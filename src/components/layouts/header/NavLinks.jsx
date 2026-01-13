export default function NavLinks({ className = '', onLinkClick }) {
  const links = ['Dashboard', 'Books', 'Users', 'Reviews'];

  return (
    <ul
      className={`flex gap-6 text-sm font-medium text-muted-foreground ${className}`}>
      {links.map(link => (
        <li
          key={link}
          className={`cursor-pointer transition-colors ${
            link === 'Reviews' ? 'text-primary' : 'hover:text-primary'
          }`}
          onClick={onLinkClick}>
          {link}
        </li>
      ))}
    </ul>
  );
}
