import { useEffect, useState } from "react";
import { db } from "./firebaseConfig.jsx";
import { doc, getDoc, updateDoc, setDoc, onSnapshot } from "firebase/firestore";
import bhardwaj from './assets/bhardwaj.png';
import narottam from './assets/narottam.png';

function ImageBattle() {
  const [likes, setLikes] = useState({ img1: 0, img2: 0 });
  const [selected, setSelected] = useState(null);
  const [winner, setWinner] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);

  const images = [
    { id: "img1", url: bhardwaj, name: "bhardwaj" },
    { id: "img2", url: narottam, name: "narottam" },
  ];

  const getImageName = (id) => {
    const img = images.find((img) => img.id === id);
    return img ? img.name : id;
  };

  // 🟢 Load selected vote from localStorage
  useEffect(() => {
    const storedVote = localStorage.getItem("imageBattleVote");
    if (storedVote) {
      setSelected(storedVote);
    }
  }, []);

  useEffect(() => {
    const initDoc = async () => {
      const ref = doc(db, "battles", "round1");
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        await setDoc(ref, {
          img1: 0,
          img2: 0,
          startTime: Date.now(),
          duration: 1000,
        });
      }
    };
    initDoc();
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "battles", "round1"), (snapshot) => {
      if (!snapshot.exists()) return;

      const data = snapshot.data();

      setLikes({
        img1: data.img1 || 0,
        img2: data.img2 || 0,
      });

      const now = Date.now();
      const endTime = (data.startTime || now) + ((data.duration || 1000) * 1000);
      const remaining = Math.max(Math.floor((endTime - now) / 1000), 0);
      setTimeLeft(remaining);

      if (remaining === 0 && !winner) {
        const img1Likes = data.img1 || 0;
        const img2Likes = data.img2 || 0;
        if (img1Likes > img2Likes) setWinner(`${getImageName("img1")} Wins!`);
        else if (img2Likes > img1Likes) setWinner(`${getImageName("img2")} Wins!`);
        else setWinner("🤝 It's a Tie!");
      }
    });

    return () => unsub();
  }, [winner]);

  useEffect(() => {
    const interval = setInterval(async () => {
      const ref = doc(db, "battles", "round1");
      const snap = await getDoc(ref);
      if (!snap.exists()) return;
      const data = snap.data();
      const now = Date.now();
      const endTime = (data.startTime || now) + ((data.duration || 1000) * 1000);
      const remaining = Math.max(Math.floor((endTime - now) / 1000), 0);
      setTimeLeft(remaining);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleVote = async (id) => {
    if (selected || winner || timeLeft === 0) return; // prevent multiple votes
    setSelected(id);

    // 🟢 Save vote in localStorage
    localStorage.setItem("imageBattleVote", id);

    const field = id;
    const newLikes = (likes[field] || 0) + 1;

    setLikes((prev) => ({ ...prev, [field]: newLikes }));

    const ref = doc(db, "battles", "round1");
    await updateDoc(ref, { [field]: newLikes });
  };

  return (
    <div style={styles.container}>
      <h1>Best choice for ....👸</h1>
      <h2>Time Left: {timeLeft}s</h2>

      <div style={styles.imageContainer}>
        {images.map((img) => (
          <div key={img.id} style={styles.card}>
            <img src={img.url} alt={img.name} style={styles.image} />
            <h3 style={{ margin: "10px 0" }}>{img.name}</h3>
            <button
              style={{
                ...styles.button,
                ...(selected === img.id && styles.selectedButton),
              }}
              onClick={() => handleVote(img.id)}
              disabled={selected || winner || timeLeft === 0}
            >
              👍 Vote
            </button>
          </div>
        ))}
      </div>

      {winner && (
        <h2 style={{ marginTop: 20, color: "green", fontSize: 24 }}>{winner}</h2>
      )}
    </div>
  );
}

const styles = {
  container: { textAlign: "center", padding: 40, fontFamily: "sans-serif" },
  imageContainer: { display: "flex", justifyContent: "center", gap: 50, marginTop: 30 },
  card: { display: "flex", flexDirection: "column", alignItems: "center" },
  image: {
    width: 300,
    height: 300,
    borderRadius: 15,
    marginBottom: 15,
    boxShadow: "0 8px 15px rgba(0,0,0,0.2)",
  },
  button: {
    padding: "12px 24px",
    fontSize: 16,
    borderRadius: 8,
    border: "none",
    backgroundColor: "#4caf50",
    color: "white",
    cursor: "pointer",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
  },
  selectedButton: { backgroundColor: "#1b5e20", transform: "scale(1.1)" },
};

export default ImageBattle;
