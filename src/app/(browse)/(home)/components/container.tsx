interface ContainerProps {
  children: React.ReactNode
}

export const Container = ({ children }: ContainerProps) => {
  return (
    <div className="inner_page">
      <main>{children}</main>
    </div>
  )
}
