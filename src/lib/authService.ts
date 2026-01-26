import { supabase } from "./Supabase"

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
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

    // Criar perfil na tabela users
    const { error: profileError } = await supabase.from("users").insert({
      id: authData.user.id,
      email: authData.user.email!,
      name: name,
    })

    if (profileError) {
      console.error("Erro ao criar perfil:", profileError)
      // Não lançar erro aqui, pois o usuário já foi criado no auth
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
    const { data: profile, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", authUser.id)
      .single()

    if (error) {
      console.error("Erro ao buscar perfil:", error)
      // Retornar dados básicos do auth se não houver perfil
      return {
        id: authUser.id,
        email: authUser.email!,
        name: authUser.user_metadata?.name || "",
      }
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
