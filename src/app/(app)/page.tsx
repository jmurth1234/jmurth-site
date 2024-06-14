import { createDataSummary } from '@/data/data-summary-creator'
import RichText from '@/components/RichText'
import PageSection from '@/components/PageSection'
import CardArea from '@/components/CardArea'
import PostSummary, { PostExcerpt } from '@/components/PostSummary'
import ProjectSummary from '@/components/ProjectSummary'
import Link from 'next/link'
import getPayload from '@/lib/payload-getter'

const Page = async () => {
  const { payload, user } = await getPayload()

  const home = await payload.findGlobal({
    slug: 'homepage',
    draft: !!user,
  })

  const posts = await payload.find({
    collection: 'posts',
    limit: 4,
    sort: '-createdAt',
    overrideAccess: false,
    user,
    draft: !!user,
  })

  const projects = await payload.find({
    collection: 'projects',
    limit: 4,
    where: {
      featured: {
        equals: true,
      },
    },
    overrideAccess: false,
    user,
    draft: !!user,
  })

  const formattedPosts = posts?.docs?.map((post) => createDataSummary(post))

  return (
    <main>
      <RichText content={home?.html} />
      <PageSection title="Latest Posts">
        <CardArea grid>
          {formattedPosts?.map((post: PostExcerpt) => (
            <PostSummary key={post.id} post={post} />
          ))}

          <Link href="/posts" className="card">
            See More {'>>'}
          </Link>
        </CardArea>
      </PageSection>

      <PageSection title="Featured Projects">
        <CardArea grid>
          {projects?.docs?.map((project) => (
            <ProjectSummary key={project.id} project={project} />
          ))}

          <Link className="card" href="/projects">
            See All Projects {'>>'}
          </Link>
        </CardArea>
      </PageSection>
    </main>
  )
}

export default Page
