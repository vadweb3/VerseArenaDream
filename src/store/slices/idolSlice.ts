import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IdolAttributes, IdolTemplate, CustomizationOption, PersonalityType } from '../../types';

interface IdolState {
  idolAttributes: IdolAttributes;
  isCreating: boolean;
  creationStep: number;
  availableTemplates: IdolTemplate[];
  availableHairStyles: CustomizationOption[];
  availableOutfits: CustomizationOption[];
  availableAccessories: CustomizationOption[];
  availablePersonalities: PersonalityType[];
}

const initialState: IdolState = {
  idolAttributes: {
    template: null,
    hairStyle: null,
    outfit: null,
    accessory: null,
    personality: null,
    voicePitch: 50,
  },
  isCreating: false,
  creationStep: 0,
  availableTemplates: [
    { id: 1, name: 'Cyberpunk Mech-Girl', image: 'https://via.placeholder.com/150?text=Mech-Girl', style: 'cyberpunk', description: 'Inspired by D.Va\'s iconic mech suit style with neon accents' },
    { id: 2, name: 'Fantasy Sorceress', image: 'https://via.placeholder.com/150?text=Fantasy', style: 'fantasy', description: 'Mystical spellcaster with ethereal appearance' },
    { id: 3, name: 'Pop Star', image: 'https://via.placeholder.com/150?text=Pop+Star', style: 'pop', description: 'Trendy performer with colorful, eye-catching style' },
    { id: 4, name: 'Steampunk Engineer', image: 'https://via.placeholder.com/150?text=Steampunk', style: 'steampunk', description: 'Victorian-era inventor with brass gear accessories' },
  ],
  availableHairStyles: [
    { id: 1, name: 'Twin Tails', style: 'cyberpunk', image: 'https://via.placeholder.com/100?text=Twin+Tails' },
    { id: 2, name: 'Long Straight', style: 'fantasy', image: 'https://via.placeholder.com/100?text=Long+Straight' },
    { id: 3, name: 'Short Bob', style: 'pop', image: 'https://via.placeholder.com/100?text=Short+Bob' },
    { id: 4, name: 'Curly', style: 'steampunk', image: 'https://via.placeholder.com/100?text=Curly' },
  ],
  availableOutfits: [
    { id: 1, name: 'Mech Suit (Pink/Blue)', style: 'cyberpunk', image: 'https://via.placeholder.com/100?text=Mech+Suit' },
    { id: 2, name: 'Mystic Robe', style: 'fantasy', image: 'https://via.placeholder.com/100?text=Mystic+Robe' },
    { id: 3, name: 'Stage Costume', style: 'pop', image: 'https://via.placeholder.com/100?text=Stage+Costume' },
    { id: 4, name: 'Brass Gear Suit', style: 'steampunk', image: 'https://via.placeholder.com/100?text=Gear+Suit' },
  ],
  availableAccessories: [
    { id: 1, name: 'Holographic Visor', style: 'cyberpunk', image: 'https://via.placeholder.com/100?text=Visor' },
    { id: 2, name: 'Magic Staff', style: 'fantasy', image: 'https://via.placeholder.com/100?text=Staff' },
    { id: 3, name: 'Microphone', style: 'pop', image: 'https://via.placeholder.com/100?text=Mic' },
    { id: 4, name: 'Gear Goggles', style: 'steampunk', image: 'https://via.placeholder.com/100?text=Goggles' },
  ],
  availablePersonalities: [
    { id: 1, name: 'Competitive Gamer', description: 'Loves challenges and thrives on competition', traits: ['Competitive', 'Determined', 'Strategic'] },
    { id: 2, name: 'Mysterious Enchantress', description: 'Enigmatic and wise with a hint of mysticism', traits: ['Mysterious', 'Wise', 'Calm'] },
    { id: 3, name: 'Bubbly Performer', description: 'Energetic and outgoing with star-quality charisma', traits: ['Energetic', 'Cheerful', 'Outgoing'] },
    { id: 4, name: 'Eccentric Inventor', description: 'Brilliant and quirky with unique perspectives', traits: ['Creative', 'Intelligent', 'Quirky'] },
  ],
};

const idolSlice = createSlice({
  name: 'idol',
  initialState,
  reducers: {
    setTemplate: (state, action: PayloadAction<IdolTemplate>) => {
      state.idolAttributes.template = action.payload;
      
      // Auto-select matching style items
      state.idolAttributes.hairStyle = state.availableHairStyles.find(
        (hair) => hair.style === action.payload.style
      ) || null;
      
      state.idolAttributes.outfit = state.availableOutfits.find(
        (outfit) => outfit.style === action.payload.style
      ) || null;
      
      state.idolAttributes.accessory = state.availableAccessories.find(
        (accessory) => accessory.style === action.payload.style
      ) || null;
    },
    setHairStyle: (state, action: PayloadAction<CustomizationOption>) => {
      state.idolAttributes.hairStyle = action.payload;
    },
    setOutfit: (state, action: PayloadAction<CustomizationOption>) => {
      state.idolAttributes.outfit = action.payload;
    },
    setAccessory: (state, action: PayloadAction<CustomizationOption>) => {
      state.idolAttributes.accessory = action.payload;
    },
    setPersonality: (state, action: PayloadAction<PersonalityType>) => {
      state.idolAttributes.personality = action.payload;
    },
    setVoicePitch: (state, action: PayloadAction<number>) => {
      state.idolAttributes.voicePitch = action.payload;
    },
    setCreationStep: (state, action: PayloadAction<number>) => {
      state.creationStep = action.payload;
    },
    nextStep: (state) => {
      state.creationStep += 1;
    },
    prevStep: (state) => {
      if (state.creationStep > 0) {
        state.creationStep -= 1;
      }
    },
    startCreating: (state) => {
      state.isCreating = true;
      state.creationStep = 0;
    },
    resetIdol: (state) => {
      state.idolAttributes = initialState.idolAttributes;
      state.creationStep = 0;
    },
  },
});

export const {
  setTemplate,
  setHairStyle,
  setOutfit,
  setAccessory,
  setPersonality,
  setVoicePitch,
  setCreationStep,
  nextStep,
  prevStep,
  startCreating,
  resetIdol,
} = idolSlice.actions;

export default idolSlice.reducer; 