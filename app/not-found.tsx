export default function NotFound() {
  return (
    <div className="card">
      <h1>Not found</h1>
      <p className="muted">This project does not exist or is no longer active.</p>
      <a className="btn secondary" href="/projects">
        Back to projects
      </a>
    </div>
  );
}

