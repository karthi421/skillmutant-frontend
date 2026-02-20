export default function ProgressSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {[1,2,3].map(i => (
        <div key={i} className="h-24 bg-zinc-800 rounded-xl" />
      ))}
    </div>
  );
}
