import { Header } from "./Header"
import { Footer } from "./Footer"

export const Layout = () => {
    return (
        <div>
            <Header />
            <main className="main__content">{children}</main>
            <Footer />
        </div>
    )
}