import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppsListRegular,
  ArrowLeftRegular,
  CartRegular,
  ChevronRightRegular,
  DropRegular,
  DismissRegular,
  FoodRegular,
  HomeRegular,
  PaintBucketBrushRegular,
  PeopleRegular,
  PillRegular,
  Send24Regular,
  SparkleRegular,
  WaterRegular,
  VehicleTruckRegular,
} from "@fluentui/react-icons";
import chatbotIcon from "../assets/chatbot.png";
import featuredProducts from "../data/featuredProducts";
import "../styles/Chatbot.css";

const MEDICINES = featuredProducts.filter((product) => product.category === "medicamentos");
const MAIN_OPTIONS = [
  { label: "¿Para qué sirve un medicamento?", key: "medicine", Icon: PillRegular },
  { label: "Explorar categorías", key: "categories", Icon: AppsListRegular },
  { label: "Ayuda con mi carrito", key: "cart", Icon: CartRegular },
  { label: "Envíos y contacto", key: "shipping", Icon: VehicleTruckRegular },
];
const CATEGORIES = [
  { label: "Todos los productos", value: "all", Icon: AppsListRegular },
  { label: "Medicamentos", value: "medicamentos", Icon: PillRegular },
  { label: "Vitaminas", value: "vitaminas", Icon: SparkleRegular },
  { label: "Belleza", value: "beauty", Icon: PaintBucketBrushRegular },
  { label: "Dermocosmética", value: "skin-care", Icon: SparkleRegular },
  { label: "Cuidado personal", value: "cuidado-personal", Icon: DropRegular },
  { label: "Cuidado del bebé", value: "cuidado-del-bebe", Icon: PeopleRegular },
  { label: "Hogar, mascotas y otros", value: "otros", Icon: HomeRegular },
  { label: "Higiene", value: "higiene", Icon: WaterRegular },
  { label: "Alimentos y bebidas", value: "groceries", Icon: FoodRegular },
];
const normalize = (value) => value.toLocaleLowerCase("es").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
const welcomeMessage = "¡Hola! Soy tu asistente virtual de Farmaxis. Puedo ayudarte a explorar productos y contarte para qué sirven los medicamentos de nuestro catálogo. ¿Qué necesitas?";

function getMedicineMatch(query) {
  const normalizedQuery = normalize(query.trim());
  if (!normalizedQuery) return null;
  return MEDICINES.find((product) =>
    [product.name, product.activeIngredient].some((term) => term && normalize(term).includes(normalizedQuery)),
  );
}

function Chatbot() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState("menu");
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState([
    { id: "welcome", sender: "bot", text: welcomeMessage },
  ]);
  const messageAreaRef = useRef(null);
  const suggestions = draft.trim()
    ? MEDICINES.filter((product) =>
      [product.name, product.activeIngredient].some((term) => term && normalize(term).includes(normalize(draft.trim()))),
    )
    : [];

  useEffect(() => {
    if (messageAreaRef.current) messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight;
  }, [messages, isOpen]);

  const addExchange = (userText, botText) => {
    setMessages((current) => {
      const id = current.length;
      return [
        ...current,
        { id: `${id}-user`, sender: "user", text: userText },
        { id: `${id}-bot`, sender: "bot", text: botText },
      ];
    });
  };

  const replyWithMedicine = (product) => {
    addExchange(
      product.name,
      `${product.name}: ${product.description} Esta información es general; no indica si es adecuado para ti ni qué dosis usar. Sigue el empaque y consulta a un profesional de salud. ¿Deseas volver al menú principal?`,
    );
    setDraft("");
    setStep("return-menu");
  };

  const selectMainOption = (option) => {
    if (option.key === "medicine") {
      addExchange(option.label, "Escribe el nombre del medicamento o su principio activo. Te mostraré opciones del catálogo.");
      setStep("medicine-search");
      return;
    }

    const replies = {
      cart: "Puedes abrir tu carrito desde el ícono de carrito en la parte superior. Allí revisas productos y cantidades; el límite es de 15 unidades por producto. ¿Deseas volver al menú principal?",
      shipping: "Por el momento no tenemos información disponible sobre envíos ni contacto. Disculpa las molestias. ¿Deseas volver al menú principal?",
    };
    if (option.key === "categories") {
      addExchange(option.label, "Elige la categoría que quieres consultar:");
      setStep("category-select");
      return;
    }
    addExchange(option.label, replies[option.key]);
    setStep("return-menu");
  };

  const selectCategory = (category) => {
    addExchange(category.label, `Abriendo el catálogo con el filtro: ${category.label}.`);
    setStep("menu");
    setIsOpen(false);
    navigate(category.value === "all" ? "/categories" : `/categories?category=${encodeURIComponent(category.value)}`);
  };

  const sendMessage = (event) => {
    event.preventDefault();
    const query = draft.trim();
    if (!query || step !== "medicine-search") return;
    const product = getMedicineMatch(query);
    if (product) {
      replyWithMedicine(product);
      return;
    }
    addExchange(query, "Por el momento no tenemos ese medicamento disponible en el catálogo. ¿Deseas volver al menú principal?");
    setDraft("");
    setStep("return-menu");
  };

  const returnToMenu = () => {
    addExchange("Sí, volver al menú", "Claro. ¿En qué puedo ayudarte?");
    setStep("menu");
  };

  const finishConversation = () => {
    addExchange("No, gracias", "Entendido. Aquí estaré si necesitas ayuda.");
    setStep("finished");
  };

  return (
    <div className="farmaxis-chat">
      {isOpen && (
        <section className={`farmaxis-chat__panel${step === "category-select" ? " farmaxis-chat__panel--categories" : ""}`} role="dialog" aria-label="Chat de ayuda de Farmaxis">
          <header className="farmaxis-chat__header">
            <img src={chatbotIcon} alt="" />
            <div><strong>Asistente virtual</strong><span>Farmaxis · ¿Cómo podemos ayudarte?</span></div>
            <button type="button" className="farmaxis-chat__close" aria-label="Cerrar chat" onClick={() => setIsOpen(false)}>×</button>
          </header>

          <div className="farmaxis-chat__messages" ref={messageAreaRef} role="log" aria-live="polite" aria-relevant="additions">
            {messages.map((message) => (
              <p key={message.id} className={`farmaxis-chat__bubble farmaxis-chat__bubble--${message.sender}`}>
                {message.text}
              </p>
            ))}
          </div>

          {step === "menu" && (
            <div className="farmaxis-chat__quick-actions farmaxis-chat__quick-actions--menu" aria-label="Menú principal">
              {MAIN_OPTIONS.map(({ label, key, Icon }) => (
                <button key={key} type="button" onClick={() => selectMainOption({ label, key })}>
                  <Icon aria-hidden="true" />
                  <span>{label}</span>
                  <ChevronRightRegular aria-hidden="true" />
                </button>
              ))}
            </div>
          )}

          {step === "return-menu" && (
            <div className="farmaxis-chat__quick-actions farmaxis-chat__quick-actions--menu" aria-label="Volver al menú principal">
              <button type="button" onClick={returnToMenu}>
                <ArrowLeftRegular aria-hidden="true" />
                <span>Sí, volver al menú principal</span>
                <ChevronRightRegular aria-hidden="true" />
              </button>
              <button type="button" onClick={finishConversation}>
                <DismissRegular aria-hidden="true" />
                <span>No, gracias</span>
                <ChevronRightRegular aria-hidden="true" />
              </button>
            </div>
          )}

          {step === "category-select" && (
            <div className="farmaxis-chat__category-actions" aria-label="Categorías del catálogo">
              <h2><span><AppsListRegular aria-hidden="true" /></span>Explorar categorías</h2>
              <div className="farmaxis-chat__category-list">
                {CATEGORIES.map(({ label, value, Icon }) => (
                  <button key={value} type="button" onClick={() => selectCategory({ label, value })}>
                    <span className="farmaxis-chat__category-icon"><Icon aria-hidden="true" /></span>
                    <span>{label}</span>
                    <ChevronRightRegular className="farmaxis-chat__category-chevron" aria-hidden="true" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === "medicine-search" && (
            <form className="farmaxis-chat__form" onSubmit={sendMessage}>
              <label className="visually-hidden" htmlFor="farmaxis-chat-input">Nombre del medicamento</label>
              <input
                id="farmaxis-chat-input"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Escribe el nombre del medicamento..."
                autoComplete="off"
                role="combobox"
                aria-autocomplete="list"
                aria-expanded={suggestions.length > 0}
                aria-controls="farmaxis-chat-suggestions"
              />
              <button type="submit" aria-label="Buscar medicamento" disabled={!draft.trim()}><Send24Regular /></button>
              {suggestions.length > 0 && (
                <div className="farmaxis-chat__suggestions" id="farmaxis-chat-suggestions" role="listbox" aria-label="Medicamentos del catálogo">
                  {suggestions.map((product) => (
                    <button key={product.id} type="button" role="option" aria-selected="false" onClick={() => replyWithMedicine(product)}>
                      <strong>{product.name}</strong>
                      {product.activeIngredient && <span>{product.activeIngredient}</span>}
                    </button>
                  ))}
                </div>
              )}
            </form>
          )}
        </section>
      )}

      <button
        className={`farmaxis-chat__launcher${isOpen ? " is-open" : ""}`}
        type="button"
        aria-label={isOpen ? "Cerrar chat" : "Abrir chat de Farmaxis"}
        aria-expanded={isOpen}
        onClick={() => {
          if (!isOpen && step === "finished") setStep("menu");
          setIsOpen((open) => !open);
        }}
      >
        {isOpen ? <span aria-hidden="true">×</span> : <img src={chatbotIcon} alt="" />}
      </button>
    </div>
  );
}

export default Chatbot;
