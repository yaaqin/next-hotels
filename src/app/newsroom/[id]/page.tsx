import ArticleEditPage from '@/src/components/pages/newsroom/edit'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <ArticleEditPage id={id} />
}
