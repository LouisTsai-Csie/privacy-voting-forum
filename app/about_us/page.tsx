import Link from "next/link";

const teamMembers = [
  {
    name: "陳竹欣 Bamboo",
    position: "Smart Contract Engineer",
    description:
      "Writes and tests smart contracts to ensure correct logic and security.",
    photo: "/images/team_member/bamboo.png",
  },
  {
    name: "蔡佳誠 Louis",
    position: "Backend Engineer",
    description:
      "Designs databases and implements APIs to ensure stable backend data flow.",
    photo: "/images/team_member/louis.png",
  },
  {
    name: "步家霖 Charlie",
    position: "Frontend Engineer",
    description:
      "Develops user interfaces, implements voting pages, and comment features.",
    photo: "/images/team_member/charlie.png",
  },
  {
    name: "許智皓 Howard",
    position: "Integration Engineer",
    description:
      "Integrates wallets and smart contracts, and introduces LLM to enhance platform interactivity.",
    photo: "/images/team_member/howard.png",
  },
];

export default function About() {
  return (
    <section className="mx-auto flex max-w-5xl flex-col items-center gap-8 px-4 py-24 text-center">
      <h1 className="text-4xl font-bold sm:text-5xl">Privacy Voting Forum</h1>
      <h2 className="text-2xl font-semibold mt-8">About Us</h2>
      <p className="max-w-2xl text-lg text-muted-foreground">
        We are a team dedicated to promoting decentralized governance. Through
        blockchain technology and innovative solutions, we aim to enhance the
        transparency and fairness of community governance.
      </p>
      <h2 className="text-2xl font-semibold mt-8">Team Members</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-4">
        {" "}
        {teamMembers.map((member, index) => (
          <div key={index} className="border rounded-lg p-4">
            <img
              src={member.photo}
              alt={member.name}
              className="w-24 h-24 object-cover rounded-full mx-auto"
            />
            <h3 className="text-xl font-semibold mt-2">{member.name}</h3>
            <p className="text-lg text-muted-foreground">{member.position}</p>
            <p className="text-sm text-muted-foreground">
              {member.description}
            </p>
          </div>
        ))}
      </div>
      <h2 className="text-2xl font-semibold">Our Mission</h2>
      <p className="max-w-2xl text-lg text-muted-foreground">
        Our mission is to build a secure, transparent, and verifiable voting
        platform where every voice can be heard, ensuring the fairness of the
        voting process.
      </p>
      <h2 className="text-2xl font-semibold">Contact Us</h2>
      <p className="max-w-2xl text-lg text-muted-foreground">
        If you are interested in our project or have any questions, please feel
        free to contact us! You can learn more through the following link:
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Link href="/" className="text-primary underline">
          Return to Home
        </Link>
      </div>
    </section>
  );
}
