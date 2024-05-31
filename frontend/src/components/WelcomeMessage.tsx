// components/WelcomeMessage.tsx

interface WelcomeMessageProps {
    name: string;
  }
  
  const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ name }) => {
    return <p>Welcome, {name}!</p>;
  }
  
  export default WelcomeMessage;
  