import { useEffect, useState } from "react";
import { db } from "./firebaseConfig.jsx";
import { doc, getDoc, updateDoc, setDoc, onSnapshot } from "firebase/firestore";

function ImageBattle() {
  const [likes, setLikes] = useState({ img1: 0, img2: 0 });
  const [selected, setSelected] = useState(null);
  const [winner, setWinner] = useState(null);
  const [timeLeft, setTimeLeft] = useState(10);

  const images = [
    { id: "img1", url: "https://placekitten.com/300/300",name:"vishal" },
    { id: "img2", url: "https://placebear.com/300/300",name:"devil" },
  ];

  const getImageName = (id) => {
    const img = images.find((img) => img.id === id);
    return img ? img.name : id;
  };

  useEffect(() => {
    const initDoc = async () => {
      const ref = doc(db, "battles", "round1");
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        await setDoc(ref, { img1: 0, img2: 0 });
      }
    };
    initDoc();
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "battles", "round1"), (snapshot) => {
      if (snapshot.exists()) {
        setLikes({
          img1: snapshot.data().img1 || 0,
          img2: snapshot.data().img2 || 0,
        });
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      const img1Likes = likes.img1 || 0;
      const img2Likes = likes.img2 || 0;

      if (img1Likes > img2Likes) setWinner(`${getImageName("img1")} Wins!`);
      else if (img2Likes > img1Likes) setWinner(`${getImageName("img2")} Wins!`);
      else setWinner("🤝 It's a Tie!");
    }
  }, [timeLeft, likes]);

  const handleVote = async (id) => {
    if (selected || winner) return;
    setSelected(id);

    const field = id;
    const newLikes = (likes[field] || 0) + 1;

    setLikes((prev) => ({ ...prev, [field]: newLikes }));

    const ref = doc(db, "battles", "round1");
    await updateDoc(ref, { [field]: newLikes });
  };

  return (
    <div style={styles.container}>
      <h1>Who is Sexy</h1>
      <h2>Time Left: {timeLeft}s</h2>

      <div style={styles.imageContainer}>
        {images.map((img) => (
          <div key={img.id} style={styles.card}>
            <img
              src={img.url}
              alt={img.name}
              style={styles.image}
            />
            <h3 style={{ margin: "10px 0" }}>{img.name}</h3>
            <button
              style={{
                ...styles.button,
                ...(selected === img.id && styles.selectedButton),
              }}
              onClick={() => handleVote(img.id)}
              disabled={selected || winner}
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
  container: {
    textAlign: "center",
    padding: 40,
    fontFamily: "sans-serif",
  },
  imageContainer: {
    display: "flex",
    justifyContent: "center",
    gap: 50,
    marginTop: 30,
  },
  card: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 15,
    marginBottom: 15,
    boxShadow: "0 8px 15px rgba(0,0,0,0.2)",
    transition: "transform 0.3s",
  },
  button: {
    padding: "12px 24px",
    fontSize: 16,
    borderRadius: 8,
    border: "none",
    backgroundColor: "#4caf50",
    color: "white",
    cursor: "pointer",
    transition: "all 0.3s",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
  },
  selectedButton: {
    backgroundColor: "#1b5e20",
    transform: "scale(1.1)",
  },
};

export default ImageBattle;
