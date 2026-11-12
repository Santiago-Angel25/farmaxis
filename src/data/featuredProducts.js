import PARACETAMOL from "../assets/PARACETAMOl.png";
import vitaminaC from "../assets/vitaminaC.png";
import aspirinaefervescente from "../assets/aspirina-efervescente.png";
import ibuprofeno from "../assets/ibuprofeno.png";
import shampooAnticaspa from "../assets/shampooAnticaspa.png";
import cremaHidratante from "../assets/cremaHidratante.png";
import protectorSolar from "../assets/protectorSolar.png";
import alcoholAntiseptico from "../assets/alcoholAntiseptico.png";
import loratadina from "../assets/loratadina.png";
import multivitaminico from "../assets/multivitaminico.png";
import omeprazol from "../assets/omeprazol.png";
import gelAntibacterial from "../assets/gelAntibacterial.png";
const featuredProducts = [
  {
    id: 1,
    category: "medicamentos",
    name: "Paracetamol 500mg",
    presentation: "Tableta de 500 mg",
    activeIngredient: "paracetamol",
    description: "Se utiliza para aliviar el dolor leve a moderado y reducir la fiebre.",
    price: 2500,
    image: PARACETAMOL,
    availability: "Envío disponible",
    discount: 15,
    previousPrice: 3000,
  },
  {
    id: 2,
    category: "vitaminas",
    name: "Vitamina C",
    price: 5000,
    image: vitaminaC,
    availability: "Envío disponible",
    discount: 10,
    previousPrice: 6000,
  },
  {
    id: 3,
    category: "medicamentos",
    name: "aspirina 500mg",
    presentation: "Tableta efervescente de 500 mg",
    activeIngredient: "ácido acetilsalicílico",
    description: "Se utiliza para aliviar el dolor leve a moderado y reducir la fiebre. Consulta a un profesional antes de usarla, especialmente en menores de edad.",
    price: 55000,
    image: aspirinaefervescente,
    availability: "Envío disponible",
    discount: 10,
    previousPrice: 61000,
  },
  {
    id: 4,
    category: "medicamentos",
    name: "Ibuprofeno 400 mg",
    presentation: "Tableta de 400 mg",
    activeIngredient: "ibuprofeno",
    description: "Se utiliza para aliviar dolores leves, reducir la fiebre y disminuir la inflamación.",
    price: 3200,
    image: ibuprofeno,
    availability: "Envío disponible",
    discount: 20,
    previousPrice: 4000,
  },
  {
    id: 5,
    category: "cuidado-personal",
    name: "Shampoo Anticaspa 400ml",
    price: 12000,
    image: shampooAnticaspa,
    availability: "Envío disponible",
    discount: 15,
    previousPrice: 14100,
  },
  {
    id: 6,
    category: "cuidado-personal",
    name: "Crema Hidratante Facial",
    price: 18000,
    image: cremaHidratante,
    availability: "Envío disponible",
    discount: 10,
    previousPrice: 20000,
  },
  {
    id: 7,
    name: "Protector Solar FPS 50+",
    category: "cuidado facial",
    subcategory: "bloqueador",
    brand: "eucerin",
    price: 25000,
    image: protectorSolar,
    availability: "Envío disponible",
    discount: 25,
    previousPrice: 33300,
  },
  {
    id: 8,
    category: "higiene",
    name: "Alcohol Antiséptico 500ml",
    price: 4500,
    image: alcoholAntiseptico,
    availability: "Envío disponible",
    discount: 0,
    previousPrice: 4500,
  },
  {
    id: 9,
    category: "medicamentos",
    name: "Loratadina 10 mg",
    presentation: "Tableta de 10 mg",
    activeIngredient: "loratadina",
    description: "Se utiliza para aliviar síntomas de alergia como estornudos, secreción nasal, picazón en la nariz o garganta y ojos llorosos.",
    price: 3800,
    image: loratadina,
    availability: "Envío disponible",
    discount: 12,
    previousPrice: 4300,
  },
  {
    id: 10,
    category: "vitaminas",
    name: "Multivitamínico Completo",
    price: 150000,
    image: multivitaminico,
    availability: "Envío disponible",
    discount: 18,
    previousPrice: 183000,
  },
  {
    id: 11,
    category: "medicamentos",
    name: "Omeprazol 20 mg",
    presentation: "Cápsula de 20 mg",
    activeIngredient: "omeprazol",
    description: "Disminuye la producción de ácido en el estómago y se utiliza para tratar problemas como el reflujo y la acidez frecuente, según la indicación del producto o de un profesional de salud.",
    price: 4200,
    image: omeprazol,
    availability: "Envío disponible",
    discount: 15,
    previousPrice: 4900,
  },
  {
    id: 12,
    category: "higiene",
    name: "Gel Antibacterial 250ml",
    price: 3500,
    image: gelAntibacterial,
    availability: "Envío disponible",
    discount: 10,
    previousPrice: 3900,
  }

];
 

export default featuredProducts;


