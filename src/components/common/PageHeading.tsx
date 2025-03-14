import './page-heading.css';

const DEFAULT_COLOR = 'dark';

interface PageHeadingProps {
    color?: 'dark' | 'light' | 'primary',
    children: React.ReactNode
}
export default function PageHeading({ color, children }: PageHeadingProps) {
    return (
        <h1
            className={`page-heading ${color ? color : DEFAULT_COLOR}`}>
            {children}
        </h1>
    )
}