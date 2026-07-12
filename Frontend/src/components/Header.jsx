export default function Header({ theme, toggleTheme, onMenuToggle, isAuthenticated, user, logout, avatarMenuOpen, setAvatarMenuOpen }) {
  const initials = user?.name?.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'U'

  return (
    <header className="topbar">
      <button type="button" className="icon-button mobile-toggle" onClick={onMenuToggle}>
        ☰
      </button>

      <label className="searchbar">
        <span className="searchbar__icon">⌕</span>
        <input type="search" placeholder="Search tasks or habits..." />
      </label>

      <div className="topbar__actions">
        <button type="button" className="icon-button" onClick={toggleTheme}>
          {theme === 'light' ? '☾' : '☀'}
        </button>

        {isAuthenticated && (
          <div className="avatar-wrap">
            <button type="button" className="avatar-button" onClick={() => setAvatarMenuOpen((value) => !value)}>
              {initials}
            </button>

            {avatarMenuOpen && (
              <div className="avatar-menu">
                <p className="avatar-menu__name">{user.name}</p>
                <p className="avatar-menu__email">{user.email || 'Premium member'}</p>
                <button type="button" className="avatar-menu__action" onClick={logout}>
                  Sign out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}