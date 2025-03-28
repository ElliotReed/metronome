import './page-heading.css';

const DEFAULT_COLOR = 'dark';

interface PageHeadingProps {
    color?: 'dark' | 'light' | 'primary',
    children: React.ReactNode
}
export const PageHeading = ({ color, children, ...rest }: PageHeadingProps) => {
    return (
        <h1
            className={`page-heading ${color ? color : DEFAULT_COLOR}`}
            {...rest}
        >
            {children}
        </h1>
    )
}