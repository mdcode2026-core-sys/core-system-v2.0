// فقط غيّر الـ Interface وأزل tenantId prop

interface LiveQueueBoardProps {
  onSelectSession?: (sessionId: string) => void;
}

export function LiveQueueBoard({ onSelectSession }: LiveQueueBoardProps) {
  const { isLoading, error } = useQueue(); // لا يحتاج parameter
  // ... باقي الكود كما هو
