import { supabase } from "./Supabase"
import type { User } from "@supabase/supabase-js"

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
}

function buildFallbackUser(authUser: User): AuthUser {
  return {
    id: authUser.id,
    email: authUser.email || "",
    name:
      authUser.user_metadata?.name ||
      authUser.user_metadata?.full_name ||
      (authUser.email ? authUser.email.split("@")[0] : "Usuário"),
  }
}

async function ensureUserProfile(authUser: User, preferredName?: string) {
  const fallback = buildFallbackUser(authUser)
  const nameToSave = preferredName?.trim() || fallback.name

  const { error } = await supabase.from("users").upsert(
    {
      id: authUser.id,
      email: fallback.email,
      name: nameToSave,
    },
    { onConflict: "id" }
  )

  if (error) throw error
}

// Registrar novo usuário
export async function signUp(email: string, password: string, name: string) {
  try {
    // Criar usuário no Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    })

    if (authError) throw authError
    if (!authData.user) throw new Error("Erro ao criar usuário")

    if (authData.session && authData.user) {
      await ensureUserProfile(authData.user, name)
    }

    return { user: authData.user, session: authData.session }
  } catch (error) {
    console.error("Erro ao registrar:", error)
    throw error
  }
}

// Fazer login
export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
    if (data.user) {
      await ensureUserProfile(data.user)
    }
    return { user: data.user, session: data.session }
  } catch (error) {
    console.error("Erro ao fazer login:", error)
    throw error
  }
}

// Fazer logout
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  } catch (error) {
    console.error("Erro ao fazer logout:", error)
    throw error
  }
}

// Obter usuário atual
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser()

    if (!authUser) return null

    // Buscar perfil completo na tabela users
    let { data: profile, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", authUser.id)
      .maybeSingle()

    if (error) {
      console.error("Erro ao buscar perfil:", error)
      return buildFallbackUser(authUser)
    }

    if (!profile) {
      try {
        await ensureUserProfile(authUser)
        const refetch = await supabase
          .from("users")
          .select("*")
          .eq("id", authUser.id)
          .maybeSingle()

        profile = refetch.data
        error = refetch.error
      } catch (profileCreationError) {
        console.error("Erro ao criar perfil automaticamente:", profileCreationError)
        return buildFallbackUser(authUser)
      }
    }

    if (error || !profile) {
      console.error("Erro ao obter perfil após tentativa de criação:", error)
      return buildFallbackUser(authUser)
    }

    return {
      id: profile.id,
      email: profile.email,
      name: profile.name,
      avatar: profile.avatar,
      bio: profile.bio,
    }
  } catch (error) {
    console.error("Erro ao obter usuário atual:", error)
    return null
  }
}

// Atualizar perfil do usuário
export async function updateUserProfile(
  userId: string,
  updates: { name?: string; bio?: string; avatar?: string }
) {
  try {
    const { data, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", userId)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error)
    throw error
  }
}

// Obter sessão atual
export async function getSession() {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    return session
  } catch (error) {
    console.error("Erro ao obter sessão:", error)
    return null
  }
}
