import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react'; // Ícones para navegação e coração
import './App.css'; // Importando o CSS para estilos personalizados


// Componente ConfettiHearts para o efeito de chuva de corações
const ConfettiHearts = () => {
  // Definindo a paleta de cores para os corações
  const heartColors = ['#a1657d', '#f1dde4', '#5e1224'];

  // Aumente o 'length' aqui para mais corações
  const hearts = Array.from({ length: 180 }).map((_, i) => ({ // Aumentado para 80 corações!
    id: i,
    left: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 3}s`, // Aumenta o delay para mais variedade
    animationDuration: `${4 + Math.random() * 3}s`, // Aumenta a duração para uma queda mais longa
    size: `${20 + Math.random() * 40}px`, // Tamanho um pouco mais variado
    rotation: `${Math.random() * 360}deg`,
    color: heartColors[Math.floor(Math.random() * heartColors.length)]
  }));

  return (
    <div className="confetti-container">
      {hearts.map((heart) => (
        <Heart
          key={heart.id}
          className="confetti-heart"
          style={{
            left: heart.left,
            animationDelay: heart.animationDelay,
            animationDuration: heart.animationDuration,
            width: heart.size,
            height: heart.size,
            transform: `rotate(${heart.rotation})`,
            color: heart.color // Aplicando a cor aleatória
          }}
        />
      ))}
      <style jsx>{`
        /* Animações CSS para o efeito de coração caindo */
        @keyframes fall {
          0% {
            transform: translateY(-10vh) rotate(var(--rotation, 0deg));
            opacity: 0;
          }
          100% {
            transform: translateY(100vh) rotate(var(--rotation, 360deg));
            opacity: 0; /* Começa a sumir no final da queda */
          }
        }

        @keyframes fadeInHeart {
          0% { opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { opacity: 0; }
        }

        .confetti-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          pointer-events: none; /* Permite interagir com elementos por baixo */
          z-index: 50;
        }

        .confetti-heart {
          position: absolute;
          animation: fall var(--animationDuration, 4s) linear forwards,
                     fadeInHeart var(--animationDuration, 4s) forwards; /* Controla o fade-in e fade-out */
          font-size: var(--size);
          will-change: transform, opacity; /* Otimização de performance */
          --rotation: 0deg; /* Variável CSS para rotação */
        }
      `}</style>
    </div>
  );
};


// Componente ConfettiHearts ... (restante do seu código)

function App() {
  const initialPhotosData = [
    { id: 1, src: "/6.jpeg", caption: "Meu amor, cada instante ao seu lado é um presente que guardo no coração." },
    { id: 2, src: "/2.jpeg", caption: "Sua risada é a melodia que ilumina e aquece meus dias." },
    { id: 3, src: "/3.jpeg", caption: "Em seus olhos, encontro a paz que acalma a alma e o brilho que me faz sentir em casa." },
    { id: 4, src: "/4.jpeg", caption: "Eu te amo por completo, em cada nuance, em cada versão. Você é perfeita do seu jeito." },
    { id: 5, src: "/5.jpeg", caption: "Às vezes, paro e percebo a imensidão da felicidade que você trouxe à minha vida. É indescritível." },
    { id: 6, src: "/1.jpeg", caption: "Seu abraço é o meu refúgio, onde a alegria se aninha e todo o mundo se silencia." },
    { id: 7, src: "/7.jpeg", caption: "Seu jeitinho único, cheio de encantos, me faz bem de um jeito que eu jamais imaginei." },
    { id: 8, src: "/8.jpeg", caption: "Mesmo antes de este dia, meu coração já sussurrava: 'É você'." },
    { id: 9, src: "/9.jpeg", caption: "Com você, tudo fica mais leve e radiante. Você me faz sentir a melhor versão de mim." },
    { id: 10, src: "/10.jpeg", caption: "Com você, a vida se torna uma aventura inesquecível, cheia de descobertas e sorrisos." },
    { id: 11, src: "/11.jpeg", caption: "Minha pequena, cada dia ao seu lado me lembra o quanto eu te amo, em todas as formas e por toda a eternidade." },
    { id: 12, src: "/12.jpeg", caption: "TE AMO." },
  ];

  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [photos] = useState(initialPhotosData); // Usamos initialPhotosData aqui
  const [showProposal, setShowProposal] = useState(false);
  const [proposalAnswer, setProposalAnswer] = useState(''); // 'Sim', 'Não', or ''
  const [showAnswerMessage, setShowAnswerMessage] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const audioRef = useRef(null); // Ref para o elemento de áudio

  // Estado para controlar a transição da imagem (fade-in)
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // Estados para navegação por toque (swipe) - ADICIONADO
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);
  const swipeThreshold = 50; // Pixels para considerar um swipe

  // Mensagem final personalizável que aparece após a resposta
  const finalPersonalizedMessage = `
    Todos os dias agradeço a Deus por ter te coloca na minha vida, fico feliz em passar todos meus proximos dias ao seu lado. 
  
      TE AMO
  `;

  // Efeito para tocar a música quando o componente é montado
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5; // Ajuste o volume se necessário
      audioRef.current.play().catch(error => console.log("Erro ao tocar áudio:", error));
    }
  }, []); // Executa apenas uma vez ao montar o componente

  // Efeito para resetar o estado de carregamento da imagem ao mudar a foto
  useEffect(() => {
    setIsImageLoaded(false); // Define como falso para iniciar o fade-in na próxima imagem
  }, [currentPhotoIndex]);

  // Função para ir para a próxima foto
  const nextPhoto = () => {
    if (showProposal) return; // Se a proposta já foi mostrada, para a navegação - ADICIONADO

    if (currentPhotoIndex < photos.length - 1) {
      setCurrentPhotoIndex((prevIndex) => prevIndex + 1);
    } else {
      // Se for a última foto, exibe a seção de proposta
      setShowProposal(true);
    }
  };

  // Função para ir para a foto anterior
  const prevPhoto = () => {
    if (showProposal) return; // Se a proposta já foi mostrada, para a navegação - ADICIONADO

    // Permite loop: se estiver na primeira foto, vai para a última - ALTERADO
    setCurrentPhotoIndex((prevIndex) =>
      prevIndex === 0 ? photos.length - 1 : prevIndex - 1
    );
  };

  // Lidar com a resposta do pedido
  const handleAnswer = (answer) => {
    setProposalAnswer(answer);
    setShowAnswerMessage(true);
    setShowConfetti(true); // Ativa a chuva de corações
    // Desativa a chuva de corações após um tempo
    setTimeout(() => setShowConfetti(false), 5000); // 5 segundos
  };

  // Efeito para adicionar navegação por teclado - ADICIONADO
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (showProposal) return; // Não navegar se a proposta estiver ativa

      if (event.key === 'ArrowLeft') {
        prevPhoto();
      } else if (event.key === 'ArrowRight') {
        nextPhoto();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentPhotoIndex, photos.length, showProposal]); // Dependências para re-executar se o estado mudar

  // Funções para navegação por toque (swipe) - ADICIONADO
  const handleTouchStart = (e) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (showProposal) return; // Não navegar se a proposta estiver ativa

    const deltaX = touchEndX - touchStartX;
    if (deltaX > swipeThreshold) {
      // Swipe para a direita (anterior)
      prevPhoto();
    } else if (deltaX < -swipeThreshold) {
      // Swipe para a esquerda (próximo)
      nextPhoto();
    }
    // Resetar os estados de toque
    setTouchStartX(0);
    setTouchEndX(0);
  };

  // Renderiza a seção de proposta
  const renderProposalSection = () => {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-[#f1dde4] rounded-xl shadow-lg animate-fade-in text-center mt-8 md:mt-12 w-full max-w-lg relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-[#5e1224] mb-6 font-inter animate-pop-in">
          Meu amor, quer namorar comigo?
        </h2>
        {showAnswerMessage ? (
          <div className="mt-4 p-4 rounded-lg bg-[#f1dde4] text-[#a1657d] text-lg md:text-xl font-semibold animate-fade-in-up">
            {proposalAnswer === 'Sim' ? (
              <>
                <span className="text-[#5e1224]">SIM! Eu também te amo muito!</span>
              </>
            ) : (
              <>
                <span className="text-[#5e1224]">
                  NÃO! tu que acha aqui é SIM tambem!
                </span>
              </>
            )}
            <p className="header-proposal">
              {finalPersonalizedMessage}
            </p>
          </div>
        ) : (
          <div className="buttons-proposal">
            <button className="button-yes transition duration-300 ease-in-out active:scale-95"
              onClick={() => handleAnswer('Sim')}
            >
              Sim!
            </button>
            <button className="button-no transition duration-300 ease-in-out active:scale-95"
              onClick={() => handleAnswer('Não')} // Este botão sempre levará ao "Sim!"
            >
              Não!
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-[#f1dde4]"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}>
      {/* Música de fundo */}
      <audio ref={audioRef} loop>
        <source src="https://www.bensound.com/bensound-music/bensound-romantic.mp3" type="audio/mpeg" />
        Seu navegador não suporta áudio HTML5.
      </audio>

      {/* Chuva de corações */}
      {showConfetti && <ConfettiHearts />}

      {/* Área da foto e legenda */}
      {!showProposal && (
        <div className="container">
          <h1>Para o Amor da minha vida!!</h1>

          <img
            src={photos[currentPhotoIndex].src}
            alt={`Foto ${currentPhotoIndex + 1}`}
            // Adicionando classes para transição de opacidade
            className={`w-full h-auto rounded-lg shadow-lg object-cover transition-opacity duration-700 ease-in-out ${
              isImageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setIsImageLoaded(true)} // Marca a imagem como carregada para o fade-in
          />
          
          <p className="text-center mt-4 text-lg text-[#5e1224] font-medium bg-[#f1dde4]/60 backdrop-blur-md p-3 rounded-lg shadow-inner">
            {photos[currentPhotoIndex].caption}
          </p>

          {/* Botões de navegação */}
          <div className='buttons-adjust'>
            <button
              onClick={prevPhoto}
              className="absolute top-1/2 left-0 transform -translate-y-1/2 p-2 bg-[#f1dde4] rounded-full shadow hover:bg-[#a1657d] transition duration-300 ease-in-out active:scale-95 z-10"
            >
              <ChevronLeft size={28} className="text-[#5e1224]" />
            </button>

            <button
              onClick={nextPhoto}
              className="absolute top-1/2 right-0 transform -translate-y-1/2 p-2 bg-[#f1dde4] rounded-full shadow hover:bg-[#a1657d] transition duration-300 ease-in-out active:scale-95 z-10"
            >
              <ChevronRight size={28} className="text-[#5e1224]" />
            </button>
          </div>
        </div>
      )}

      {/* Seção de proposta */}
      {showProposal && renderProposalSection()}
    </div>
  );
}

export default App;
