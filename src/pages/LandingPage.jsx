import { Link } from "react-router-dom";
import Layout from "./Layout";
function LandingPage() {
  return (
    <div className="min-vh-100 bg-light">
      <Layout>
      <div className="container py-5">
        <div className="row justify-content-center text-center mb-5">
          <div className="col-lg-8">
            <div className="hero-content">
              <h1 className="display-4 fw-bold text-primary mb-4">
                Welcome to Your CRM Dashboard 
                <span className="text-warning ms-2">🎉</span>
              </h1>
              <p className="lead text-muted mb-4">
                Streamline your marketing efforts with our powerful CRM platform. 
                Manage campaigns, track delivery logs, and leverage AI-powered suggestions 
                to engage your customers like never before.
              </p>
            </div>
          </div>
        </div>
        <div className="row mb-5">
          <div className="col-md-4 text-center mb-4">
            <div className="bg-white rounded-3 shadow-sm p-4 h-100">
              <div className="text-primary mb-3">
                <i className="bi bi-lightning-charge" style={{fontSize: '3rem'}}></i>
              </div>
              <h3 className="h4 fw-bold">Lightning Fast</h3>
              <p className="text-muted mb-0">Deploy campaigns in seconds with our streamlined interface</p>
            </div>
          </div>
          <div className="col-md-4 text-center mb-4">
            <div className="bg-white rounded-3 shadow-sm p-4 h-100">
              <div className="text-success mb-3">
                <i className="bi bi-robot" style={{fontSize: '3rem'}}></i>
              </div>
              <h3 className="h4 fw-bold">AI-Powered</h3>
              <p className="text-muted mb-0">Get intelligent message suggestions powered by advanced AI</p>
            </div>
          </div>
          <div className="col-md-4 text-center mb-4">
            <div className="bg-white rounded-3 shadow-sm p-4 h-100">
              <div className="text-info mb-3">
                <i className="bi bi-graph-up" style={{fontSize: '3rem'}}></i>
              </div>
              <h3 className="h4 fw-bold">Analytics</h3>
              <p className="text-muted mb-0">Track performance with detailed delivery logs and metrics</p>
            </div>
          </div>
        </div>

        <div className="row mb-5">
          <div className="col-12 text-center mb-4">
            <h2 className="fw-bold text-dark mb-2">Quick Access</h2>
            <p className="text-muted">Jump straight into managing your marketing operations</p>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-md-4">
            <Link to="/campaigns" className="text-decoration-none">
              <div className="card h-100 shadow-sm border-0 hover-card">
                <div className="card-body text-center p-4">
                  <div className="mb-3">
                    <i className="bi bi-megaphone text-primary" style={{fontSize: '3rem'}}></i>
                  </div>
                  <h3 className="card-title h4 fw-bold text-dark mb-3">Campaigns</h3>
                  <p className="card-text text-muted mb-4">
                    Create, launch, and track your marketing campaigns with AI-powered message generation and detailed analytics.
                  </p>
                  <div className="btn btn-outline-primary">
                    Get Started <i className="bi bi-arrow-right ms-1"></i>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          <div className="col-md-4">
            <Link to="/segments" className="text-decoration-none">
              <div className="card h-100 shadow-sm border-0 hover-card">
                <div className="card-body text-center p-4">
                  <div className="mb-3">
                    <i className="bi bi-collection text-success" style={{fontSize: '3rem'}}></i>
                  </div>
                  <h3 className="card-title h4 fw-bold text-dark mb-3">Segments</h3>
                  <p className="card-text text-muted mb-4">
                    Define and manage precise audience segments based on customer behavior, demographics, and preferences.
                  </p>
                  <div className="btn btn-outline-success">
                    Manage Segments <i className="bi bi-arrow-right ms-1"></i>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          <div className="col-md-4">
            <Link to="/customers" className="text-decoration-none">
              <div className="card h-100 shadow-sm border-0 hover-card">
                <div className="card-body text-center p-4">
                  <div className="mb-3">
                    <i className="bi bi-people text-info" style={{fontSize: '3rem'}}></i>
                  </div>
                  <h3 className="card-title h4 fw-bold text-dark mb-3">Customers</h3>
                  <p className="card-text text-muted mb-4">
                    Access comprehensive customer profiles, engagement history, and communication preferences in one place.
                  </p>
                  <div className="btn btn-outline-info">
                    View Customers <i className="bi bi-arrow-right ms-1"></i>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
      </Layout>

      <footer className="bg-dark text-light py-4 mt-5">
        <div className="container text-center">
          <p className="mb-0">&copy; 2025 Mini CRM. Built with ❤️ for better customer engagement.</p>
        </div>
      </footer>

      <style>{`
        body {
          overflow-x: hidden;
          overflow-y: auto !important;
        }
        .hover-card {
          transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
        }
        .hover-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
        }
        .hero-content {
          animation: fadeInUp 0.8s ease-out;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default LandingPage;