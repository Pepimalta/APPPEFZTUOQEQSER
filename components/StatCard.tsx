type StatCardProps = {
  label: string;
  value: number;
};

export function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="rounded-lg border border-[#d8ccb9] bg-[#fffaf0] px-4 py-3 text-center shadow-sm">
      <div className="text-2xl font-black">{value}</div>
      <div className="text-xs font-bold uppercase tracking-[0.12em] text-[#68705d]">{label}</div>
    </div>
  );
}
