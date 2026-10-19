import { ChartAreaInteractive } from "@/components/sidebar/chart-area-interactive"
import { SectionCards } from "@/components/sidebar/section-cards"

const AdminIndexPage = () => {
  return (
    <>
      <SectionCards />
      <div className="min-w-0 px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
    </>
  )
}

export default AdminIndexPage
