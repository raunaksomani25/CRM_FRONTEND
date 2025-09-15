import { Link } from "react-router-dom";

function Layout({ children }) {
  return (
    <div className="min-vh-100 bg-light">
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
        <div className="container">
          <Link className="navbar-brand fw-bold fs-3" to="/">
            <i className="bi bi-graph-up-arrow me-2"></i>
            Mini CRM
          </Link>
          
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link fw-medium" to="/campaigns">
                  <i className="bi bi-megaphone me-1"></i>
                  Campaigns
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link fw-medium" to="/segments">
                  <i className="bi bi-collection me-1"></i>
                  Segments
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link fw-medium" to="/customers">
                  <i className="bi bi-people me-1"></i>
                  Customers
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <main>
        {children}
      </main>
    </div>
  );
}

export default Layout;