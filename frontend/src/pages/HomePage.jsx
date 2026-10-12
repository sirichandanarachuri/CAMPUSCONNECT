const HomePage = () => {
  return (
    <>
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-lg-7">
              <p className="text-uppercase small mb-3 text-light">Career hub for students and companies</p>
              <h1 className="display-5 fw-bold mb-3">Connect talent with opportunity.</h1>
              <p className="lead mb-4 text-light">
                CAMPUSCONNECT brings together students, employers, placement officers, and administrators in a single intelligent college placement platform.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <a href="/register" className="btn btn-light btn-lg">Create Account</a>
                <a href="/login" className="btn btn-outline-light btn-lg">Login</a>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="bg-white text-dark rounded-4 p-4 shadow">
                <h4 className="fw-bold mb-3">Platform Highlights</h4>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">Student profiles and resumes</li>
                  <li className="list-group-item">Job eligibility and application tracking</li>
                  <li className="list-group-item">Interview scheduling and status updates</li>
                  <li className="list-group-item">Placement officer oversight and reporting</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container py-5">
        <div className="row g-4 text-center">
          <div className="col-md-3">
            <div className="card dashboard-card h-100 p-4">
              <h3>Students</h3>
              <p>Build profiles, upload resumes, and apply to jobs.</p>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card dashboard-card h-100 p-4">
              <h3>Companies</h3>
              <p>Post jobs, review candidates, and schedule interviews.</p>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card dashboard-card h-100 p-4">
              <h3>Placement Officers</h3>
              <p>Monitor applicants, placements, and placement summaries.</p>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card dashboard-card h-100 p-4">
              <h3>Admin</h3>
              <p>Manage users, organizations, and platform-wide activity.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;

