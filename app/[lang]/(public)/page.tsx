import Link from "next/link"
// import { prisma } from "@/lib/prisma"
import { getTranslations } from "next-intl/server"

export default async function LandingPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const t = await getTranslations("nav")

  // ডাটাবেজ থেকে এই ভাষার সাম্প্রতিক ৬টি পোস্ট ফেচ করা
  // const latestPosts = await prisma.post.findMany({
  //   where: { language: lang },
  //   orderBy: { createdAt: "desc" },
  //   take: 6,
  // })

  return (
    <div className="min-h-screen  text-slate-900">
      {/* ১. Hero Section */}
      <section className="bg-primary px-4 py-20 text-center text-white">
        <div className="mx-auto max-w-4xl space-y-6">
          <span className="rounded-full  px-3 py-1 text-xs font-semibold tracking-wider text-emerald-100 uppercase">
            Health & Natural Living
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            আপনার সুস্থ ও দীর্ঘায়ু জীবনের বিশ্বস্ত গাইড
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-emerald-100">
            পুষ্টি, স্বাস্থ্য এবং ফিটনেস নিয়ে জানুন বিজ্ঞানসম্মত ও প্রাকৃতিক সব
            তথ্য। সুস্থ থাকুন, সুন্দর জীবন গড়ুন।
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <Link
              href={`/${lang}/category/health`}
              className="rounded-lg bg-white px-6 py-3 font-medium text-emerald-800 shadow transition hover:bg-emerald-50"
            >
              {t("health")} আর্টিকেল পড়ুন
            </Link>
          </div>
        </div>
      </section>

      {/* ২. Categories Grid Section */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-2xl font-bold">প্রধান ক্যাটাগরি সমূহ</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Link
            href={`/${lang}/category/health`}
            className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-emerald-500"
          >
            <div className="mb-3 text-3xl">🩺</div>
            <h3 className="text-xl font-semibold group-hover:text-emerald-600">
              {t("health")}
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              রোগ প্রতিরোধ ও দৈনন্দিন স্বাস্থ্য সুরক্ষা টিপস।
            </p>
          </Link>

          <Link
            href={`/${lang}/category/nutrition`}
            className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-emerald-500"
          >
            <div className="mb-3 text-3xl">🥗</div>
            <h3 className="text-xl font-semibold group-hover:text-emerald-600">
              {t("nutrition")}
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              সঠিক খাদ্যভ্যাস, ফলমূল ও ভেষজ উপাদানের গুণাগুণ।
            </p>
          </Link>

          <Link
            href={`/${lang}/category/sports`}
            className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-emerald-500"
          >
            <div className="mb-3 text-3xl">🏃‍♂️</div>
            <h3 className="text-xl font-semibold group-hover:text-emerald-600">
              {t("sports")}
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              ব্যায়াম, ফিটনেস এক্সারসাইজ এবং স্পোর্টস লাইফস্টাইল।
            </p>
          </Link>
        </div>
      </section>

      {/* ৩. Latest Blog Posts Section */}
      {/* <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">সর্বশেষ প্রকাশিত আর্টিকেল</h2>
        </div>

        {latestPosts.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
            <p className="text-slate-500">
              এই ভাষায় এখনো কোনো পোস্ট পাবলিশ করা হয়নি। খুব শীঘ্রই নতুন আর্টিকেল
              আসছে!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {latestPosts.map((post) => (
              <Link
                key={post.id}
                href={`/${lang}/posts/${post.slug || post.id}`}
                className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
              >
                {post.imageUrl && (
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="h-48 w-full object-cover"
                  />
                )}
                <div className="flex flex-grow flex-col p-5">
                  <h3 className="mb-2 text-lg font-bold text-slate-800">
                    {post.title}
                  </h3>
                  <p className="line-clamp-2 flex-grow text-sm text-slate-600">
                    {post.excerpt}
                  </p>
                  <span className="mt-4 inline-block text-xs font-medium text-emerald-600">
                    সম্পূর্ণ পড়ুন →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section> */}

      {/* ৪. AdSense Placeholder Section */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-200 p-8 text-center text-slate-500">
          Google AdSense Banner Placement Area
        </div>
      </section>
    </div>
  )
}
