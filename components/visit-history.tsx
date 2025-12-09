export default function VisitHistory() {
  return (
    <div className="bg-card rounded-lg p-6 border border-border">
      <h3 className="font-semibold text-foreground mb-4">Visit History</h3>
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-muted-foreground">&lt;</span>
        <span className="text-xs text-muted-foreground font-medium">07-04-2019</span>
        <span className="text-xs text-muted-foreground">&gt;</span>
      </div>
      <div className="space-y-2 text-sm text-muted-foreground">
        <p>No visit records for the selected date.</p>
      </div>
    </div>
  )
}
