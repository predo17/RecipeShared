import Preview from '@/components/RecipeDetailsComponents/Preview'
import { useParams } from 'react-router-dom'

export default function RecipesPageDetails() {
  const { title } = useParams<{ title: string }>()

  return (
    <>
      <Preview title={title} />
    </>
  )
}
