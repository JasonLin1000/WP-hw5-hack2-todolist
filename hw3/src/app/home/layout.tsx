export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <section className="flex-col min-h-fit">
      <h1 className="text-3xl font-bold">
        This is test 1
      </h1>
      {children}
    </section>
  )
}