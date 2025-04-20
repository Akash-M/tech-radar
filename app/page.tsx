import TechRadarPage from "@/components/tech-radar-page"
import { TechRadarProvider } from "@/components/tech-radar-context"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Developer Technology Radar | Best Software Tools & Frameworks",
  description:
    "Compare and evaluate the best software development tools, frameworks, and libraries. Our interactive technology radar helps developers make informed decisions for their tech stack.",
  keywords:
    "technology radar, software comparison, best development tools, JavaScript frameworks, frontend libraries, developer tools, tech stack, software recommendations",
}

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Technology Radar for Developers</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Track and visualize technology adoption and trends. Use mouse wheel or zoom controls to zoom in/out.
        </p>
      </div>

      <section className="mb-12 prose prose-gray max-w-none dark:prose-invert">
        <h2 className="text-2xl font-semibold mb-4">Find the Best Software for Your Next Project</h2>
        <p>
          Our Technology Radar is a visual tool that helps developers navigate the rapidly evolving software landscape.
          Whether you're building a new application, modernizing legacy systems, or exploring emerging technologies,
          this interactive guide provides data-driven insights to inform your technical decisions.
        </p>

        <div className="grid md:grid-cols-2 gap-6 my-6">
          <div>
            <h3 className="text-xl font-medium">Why Use Our Tech Radar?</h3>
            <ul>
              <li>
                <strong>Data-driven recommendations</strong> based on GitHub stars, contributors, and release frequency
              </li>
              <li>
                <strong>Compare technologies</strong> across different categories and adoption stages
              </li>
              <li>
                <strong>Visualize relationships</strong> between complementary tools and frameworks
              </li>
              <li>
                <strong>Stay current</strong> with the latest industry trends and best practices
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-medium">How to Use the Radar</h3>
            <ul>
              <li>
                Use the <strong>filter controls</strong> to narrow down technologies by category, popularity, or other
                metrics
              </li>
              <li>
                Toggle between <strong>radar view</strong> and <strong>table view</strong> for different perspectives
              </li>
              <li>
                Click on any technology to see <strong>detailed information</strong> including GitHub stats
              </li>
              <li>
                Enable <strong>relationship lines</strong> to see how technologies connect with each other
              </li>
            </ul>
          </div>
        </div>

        <h3 className="text-xl font-medium">Understanding the Quadrants</h3>
        <p>
          Our radar organizes technologies into four quadrants to help you understand their current position in the
          industry:
        </p>
        <ul>
          <li>
            <strong>Adopt:</strong> Proven technologies that we confidently recommend for production use
          </li>
          <li>
            <strong>Trial:</strong> Technologies worth exploring with the goal of understanding how they would affect
            your project
          </li>
          <li>
            <strong>Assess:</strong> Technologies worth keeping an eye on, but not yet ready for widespread use
          </li>
          <li>
            <strong>Hold:</strong> Technologies that should be approached with caution or are being phased out
          </li>
        </ul>
      </section>

      <TechRadarProvider>
        <TechRadarPage />
      </TechRadarProvider>

      <section className="mt-16 prose prose-gray max-w-none dark:prose-invert">
        <h2 className="text-2xl font-semibold mb-4">Making Informed Technology Decisions</h2>
        <p>
          Choosing the right technologies for your project is critical to its success. Our Technology Radar helps you
          make informed decisions by providing:
        </p>

        <div className="grid md:grid-cols-3 gap-6 my-6">
          <div className="border p-4 rounded-lg">
            <h3 className="text-xl font-medium">Community Support</h3>
            <p>
              Evaluate technologies based on their GitHub stars, number of contributors, and frequency of updates to
              ensure you're selecting well-maintained tools with active communities.
            </p>
          </div>
          <div className="border p-4 rounded-lg">
            <h3 className="text-xl font-medium">Industry Adoption</h3>
            <p>
              Understand which technologies are being widely adopted, which are emerging, and which are declining in
              popularity to align your tech stack with industry trends.
            </p>
          </div>
          <div className="border p-4 rounded-lg">
            <h3 className="text-xl font-medium">Compatibility</h3>
            <p>
              Discover relationships between different technologies to build a cohesive tech stack with tools and
              frameworks that work well together.
            </p>
          </div>
        </div>

        <h3 className="text-xl font-medium">Stay Updated</h3>
        <p>
          The software development landscape evolves rapidly. Our Technology Radar is regularly updated to reflect the
          latest trends, emerging technologies, and changing best practices. Bookmark this page and check back regularly
          to stay informed about the tools that can give your projects a competitive edge.
        </p>
      </section>
    </main>
  )
}

