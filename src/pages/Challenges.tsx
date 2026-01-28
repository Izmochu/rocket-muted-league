import { useEffect, useState } from "react";
import { getPendingChallenges, getAcceptedChallenges, Challenge } from "@/lib/data";
import { Layout } from "@/components/Layout";
import { ChallengesList } from "@/components/ChallengesList";
import { Target } from "lucide-react";

const Challenges = () => {
  const [pending, setPending] = useState<Challenge[]>([]);
  const [accepted, setAccepted] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchChallenges() {
      const [pendingData, acceptedData] = await Promise.all([
        getPendingChallenges(),
        getAcceptedChallenges(),
      ]);
      setPending(pendingData);
      setAccepted(acceptedData);
      setLoading(false);
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
