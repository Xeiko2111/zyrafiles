import { useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useUploads } from "../hooks/useUploads";
import { useFilteredUploads } from "../hooks/useFilteredUploads";
import { useRouter } from "../lib/router";
import { UserProfile } from "../components/profile/UserProfile";
import { GroupedByDate } from "../components/activity/GroupedByDate";
import { ActivityFilters, type FilterValue } from "../components/activity/ActivityFilters";
import { Button } from "../components/ui/Button";
import { ActivitySkeleton } from "../components/ui/Skeleton";
import { EmptyState, ErrorState } from "../components/ui/States";

export default function Profile({ userId }: { userId: string }) {
  const { getUser, user: me } = useAuth();
  const { uploads, status, reload } = useUploads();
  const { navigate } = useRouter();
  const person = getUser(userId);
  const theirs = useMemo(() => uploads.filter((u) => u.userId === userId), [uploads, userId]);
  const [filters, setFilters] = useState<FilterValue>({ query: "", userId: "all", range: "all", from: "", to: "" });
  const list = useFilteredUploads(theirs, filters);

  if (!person) {
    return (
      <EmptyState
        title="Usuario no encontrado"
        description="Este perfil no existe o ya no forma parte del equipo."
        action={<Button onClick={() => navigate("/app/activity")}>Ver el equipo</Button>}
      />
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <button onClick={() => navigate("/app/activity")} className="inline-flex w-fit items-center gap-1.5 text-sm text-fg-muted transition hover:text-fg">
        <ArrowLeft className="h-4 w-4" /> Actividad del equipo
      </button>
      <UserProfile user={person} uploads={theirs} isMe={me?.id === person.id} />
      <section>
        <h2 className="h2 mb-4 text-2xl">Actividad de {person.displayName}</h2>
        <ActivityFilters value={filters} onChange={setFilters} showUsers={false} />
        <div className="mt-6">
          {status === "loading" ? (
            <ActivitySkeleton />
          ) : status === "error" ? (
            <ErrorState onRetry={reload} />
          ) : list.length ? (
            <GroupedByDate uploads={list} showUser={false} />
          ) : (
            <EmptyState title="Sin publicaciones" description={`${person.displayName} no tiene publicaciones con estos filtros.`} showUploadAction={me?.id === person.id} />
          )}
        </div>
      </section>
    </div>
  );
}
