import { useEffect, useState } from "react";
import { 
  getPendingChallenges, 
  getAcceptedChallenges, 
  Challenge as ServiceChallenge 
} from "@/services/challenges.service";
import { Challenge as DomainChallenge, ChallengeStatus } from "@/domain/challenge";
import { Layout } from "@/components/Layout";
import { ChallengesList } from "@/components/ChallengesList";
import { Target } from "lucide-react";

// Función auxiliar para convertir el tipo de Servicio al tipo de Dominio (Vista)
function mapChallenge(c: ServiceChallenge): DomainChallenge {
  return {
    id: c.id,
    status: c.status as ChallengeStatus,
    created_at: c.created_at,
    match_id: null, // El servicio actual no devuelve match_id en esta vista
    challenger: {
      id: c.challenger?.id ?? "unknown",
      username: c.challenger?.username ?? "Unknown",
      region: "Unknown", // Dato no disponible en esta query ligera
      rank_1v1: "Unknown",
      wins: 0,
      losses: 0
    },
    challenged: {
      id: c.challenged?.id ?? "unknown",
      username: c.challenged?.username ?? "Unknown",
      region: "Unknown",
      rank_1v1: "Unknown",
      wins: 0,
      losses: 0
    }
  };
}

const Challenges = () => {
  const [pending, setPending] = useState<DomainChallenge[]>([]);
  const [accepted, setAccepted] = useState<DomainChallenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchChallenges() {
      try {
        const [pendingData, acceptedData] = await Promise.all([
          getPendingChallenges(),
          getAcceptedChallenges(),
        ]);
        
        // Mapeamos los datos para que el componente visual no se queje
        setPending(pendingData.map(mapChallenge));
        setAccepted(acceptedData.map(mapChallenge));
      } catch (error) {
        console.error("Failed to load challenges", error);
      } finally {
        setLoading(false);
      }
    }
    fetchChallenges();
  }, []);

  return (
    <Layout>
      <section className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Target className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-display font-bold">Challenges</h1>
        </div>
        <p className="text-muted-foreground">
          View and manage match challenges
        </p>
      </section>

      {loading ? (
        <p className="text-center text-muted-foreground py-8">Loading challenges...</p>
      ) : (
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="animate-fade-in">
            <ChallengesList challenges={pending} title="Pending Challenges" />
          </div>
          <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <ChallengesList challenges={accepted} title="Accepted - Ready to Play" />
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Challenges;