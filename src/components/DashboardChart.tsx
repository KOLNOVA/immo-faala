export default function DashboardChart({ listings, maxViews }: { listings: any[]; maxViews: number }) {
  const colors = ["#3498db", "#27ae60", "#f39c12", "#e74c3c", "#9b59b6", "#1abc9c", "#e67e22", "#2c3e50"];

  return (
    <div className="listings-table" style={{ marginBottom: 30 }}>
      <h2>📊 Vues par annonce</h2>
      <div style={{ padding: 20 }}>
        {listings.slice(0, 8).map((listing: any, index: number) => {
          const pct = maxViews > 0 ? ((listing.viewsCount || 0) / maxViews) * 100 : 0;
          return (
            <div key={listing.id} style={{ display: "flex", alignItems: "center", marginBottom: 12, gap: 12 }}>
              <span style={{ minWidth: 140, fontSize: "0.85em", textAlign: "right" }}>
                {listing.title?.length > 20 ? listing.title.substring(0, 20) + "..." : listing.title}
              </span>
              <div style={{ flex: 1, background: "#ecf0f1", borderRadius: 8, height: 28, overflow: "hidden" }}>
                <div
                  style={{
                    width: `${Math.max(pct, 2)}%`,
                    height: "100%",
                    background: colors[index % colors.length],
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    paddingLeft: 10,
                    color: "white",
                    fontSize: "0.75em",
                    fontWeight: 600,
                    minWidth: pct > 0 ? "auto" : "30px",
                    transition: "width 1s ease",
                  }}
                >
                  {pct > 8 && listing.viewsCount}
                </div>
              </div>
              <span style={{ minWidth: 50, fontSize: "0.85em", fontWeight: 600 }}>👁 {listing.viewsCount || 0}</span>
            </div>
          );
        })}
        {listings.length > 8 && (
          <p style={{ textAlign: "center", color: "#999", marginTop: 10 }}>
            + {listings.length - 8} autre(s) annonce(s)
          </p>
        )}
      </div>
    </div>
  );
}
