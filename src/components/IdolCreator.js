import React, { useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Image,
  Select,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react';

// Mock data for idol customization options
const idolTemplates = [
  { id: 1, name: 'Cyberpunk Mech-Girl', image: 'https://via.placeholder.com/150?text=Mech-Girl', style: 'cyberpunk' },
  { id: 2, name: 'Fantasy Sorceress', image: 'https://via.placeholder.com/150?text=Fantasy', style: 'fantasy' },
  { id: 3, name: 'Pop Star', image: 'https://via.placeholder.com/150?text=Pop+Star', style: 'pop' },
  { id: 4, name: 'Steampunk Engineer', image: 'https://via.placeholder.com/150?text=Steampunk', style: 'steampunk' },
];

const hairStyles = [
  { id: 1, name: 'Twin Tails', style: 'cyberpunk' },
  { id: 2, name: 'Long Straight', style: 'fantasy' },
  { id: 3, name: 'Short Bob', style: 'pop' },
  { id: 4, name: 'Curly', style: 'steampunk' },
];

const outfits = [
  { id: 1, name: 'Mech Suit (Pink/Blue)', style: 'cyberpunk' },
  { id: 2, name: 'Mystic Robe', style: 'fantasy' },
  { id: 3, name: 'Stage Costume', style: 'pop' },
  { id: 4, name: 'Brass Gear Suit', style: 'steampunk' },
];

const accessories = [
  { id: 1, name: 'Holographic Visor', style: 'cyberpunk' },
  { id: 2, name: 'Magic Staff', style: 'fantasy' },
  { id: 3, name: 'Microphone', style: 'pop' },
  { id: 4, name: 'Gear Goggles', style: 'steampunk' },
];

const personalities = [
  { id: 1, name: 'Competitive Gamer' },
  { id: 2, name: 'Mysterious Enchantress' },
  { id: 3, name: 'Bubbly Performer' },
  { id: 4, name: 'Eccentric Inventor' },
];

const IdolCreator = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedHair, setSelectedHair] = useState(null);
  const [selectedOutfit, setSelectedOutfit] = useState(null);
  const [selectedAccessory, setSelectedAccessory] = useState(null);
  const [selectedPersonality, setSelectedPersonality] = useState(null);
  const [voicePitch, setVoicePitch] = useState(50);
  const toast = useToast();

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    // Auto-select matching style items
    const matchingHair = hairStyles.find(hair => hair.style === template.style);
    const matchingOutfit = outfits.find(outfit => outfit.style === template.style);
    const matchingAccessory = accessories.find(acc => acc.style === template.style);
    
    setSelectedHair(matchingHair);
    setSelectedOutfit(matchingOutfit);
    setSelectedAccessory(matchingAccessory);
  };

  const handleCreate = () => {
    if (!selectedTemplate) {
      toast({
        title: "Selection required",
        description: "Please select a template first",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    toast({
      title: "Virtual Idol Created",
      description: `Your ${selectedTemplate.name} idol is ready for the metaverse!`,
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  const handleMint = () => {
    if (!selectedTemplate) {
      toast({
        title: "Selection required",
        description: "Please create an idol first",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    toast({
      title: "Connect Wallet",
      description: "Please connect your wallet to mint your idol as an NFT",
      status: "info",
      duration: 5000,
      isClosable: true,
    });
  };

  return (
    <Box
      borderWidth={1}
      borderColor="rgba(255, 87, 185, 0.3)"
      borderRadius="lg"
      p={6}
      bg="rgba(0, 0, 0, 0.3)"
      backdropFilter="blur(10px)"
    >
      <Tabs variant="soft-rounded" colorScheme="pink">
        <TabList>
          <Tab>1. Choose Template</Tab>
          <Tab isDisabled={!selectedTemplate}>2. Customize</Tab>
          <Tab isDisabled={!selectedTemplate}>3. Personality</Tab>
          <Tab isDisabled={!selectedTemplate}>4. Voice</Tab>
        </TabList>

        <TabPanels>
          {/* Template Selection Panel */}
          <TabPanel>
            <Heading size="md" mb={4}>Select a Base Template</Heading>
            <Text mb={4} opacity={0.8}>
              Choose from D.Va-inspired cyberpunk templates or explore other styles
            </Text>
            <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={6}>
              {idolTemplates.map((template) => (
                <GridItem key={template.id}>
                  <Box
                    borderWidth={2}
                    borderRadius="md"
                    overflow="hidden"
                    borderColor={selectedTemplate?.id === template.id ? "brand.primary" : "transparent"}
                    cursor="pointer"
                    transition="all 0.3s"
                    _hover={{ transform: "translateY(-5px)", boxShadow: "0 0 15px #FF57B9" }}
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <Image src={template.image} alt={template.name} />
                    <Box p={4} bg="rgba(0, 0, 0, 0.5)">
                      <Text fontWeight="bold">{template.name}</Text>
                    </Box>
                  </Box>
                </GridItem>
              ))}
            </Grid>
          </TabPanel>

          {/* Customization Panel */}
          <TabPanel>
            <Heading size="md" mb={4}>Customize Your Idol</Heading>
            <Grid templateColumns={["1fr", "1fr", "1fr 1fr"]} gap={6}>
              <GridItem>
                <VStack align="start" spacing={4}>
                  <Box>
                    <Text mb={2}>Hair Style</Text>
                    <Select
                      value={selectedHair?.id || ""}
                      onChange={(e) => setSelectedHair(hairStyles.find(h => h.id === parseInt(e.target.value)))}
                      bg="rgba(0, 0, 0, 0.3)"
                    >
                      <option value="">Select Hair Style</option>
                      {hairStyles.map(hair => (
                        <option key={hair.id} value={hair.id}>{hair.name}</option>
                      ))}
                    </Select>
                  </Box>
                  
                  <Box>
                    <Text mb={2}>Outfit</Text>
                    <Select
                      value={selectedOutfit?.id || ""}
                      onChange={(e) => setSelectedOutfit(outfits.find(o => o.id === parseInt(e.target.value)))}
                      bg="rgba(0, 0, 0, 0.3)"
                    >
                      <option value="">Select Outfit</option>
                      {outfits.map(outfit => (
                        <option key={outfit.id} value={outfit.id}>{outfit.name}</option>
                      ))}
                    </Select>
                  </Box>
                  
                  <Box>
                    <Text mb={2}>Accessories</Text>
                    <Select
                      value={selectedAccessory?.id || ""}
                      onChange={(e) => setSelectedAccessory(accessories.find(a => a.id === parseInt(e.target.value)))}
                      bg="rgba(0, 0, 0, 0.3)"
                    >
                      <option value="">Select Accessory</option>
                      {accessories.map(acc => (
                        <option key={acc.id} value={acc.id}>{acc.name}</option>
                      ))}
                    </Select>
                  </Box>
                </VStack>
              </GridItem>
              
              <GridItem>
                <Box
                  borderWidth={1}
                  borderColor="rgba(255, 87, 185, 0.3)"
                  borderRadius="lg"
                  p={4}
                  height="100%"
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                  bg="rgba(0, 0, 0, 0.2)"
                >
                  <Image
                    src={selectedTemplate?.image || "https://via.placeholder.com/300?text=Preview"}
                    alt="Idol Preview"
                    boxSize="300px"
                    objectFit="cover"
                    borderRadius="md"
                    mb={4}
                  />
                  <Text fontSize="sm" opacity={0.7}>3D preview will be available in the full version</Text>
                </Box>
              </GridItem>
            </Grid>
          </TabPanel>

          {/* Personality Panel */}
          <TabPanel>
            <Heading size="md" mb={4}>Set Personality</Heading>
            <Text mb={4} opacity={0.8}>
              Choose a personality type for your virtual idol
            </Text>
            
            <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={6}>
              {personalities.map((personality) => (
                <GridItem key={personality.id}>
                  <Box
                    p={4}
                    borderWidth={2}
                    borderRadius="md"
                    borderColor={selectedPersonality?.id === personality.id ? "brand.primary" : "transparent"}
                    bg="rgba(0, 0, 0, 0.3)"
                    cursor="pointer"
                    transition="all 0.3s"
                    _hover={{ bg: "rgba(255, 87, 185, 0.1)" }}
                    onClick={() => setSelectedPersonality(personality)}
                  >
                    <Text fontWeight="bold">{personality.name}</Text>
                  </Box>
                </GridItem>
              ))}
            </Grid>
          </TabPanel>

          {/* Voice Panel */}
          <TabPanel>
            <Heading size="md" mb={4}>Voice Settings</Heading>
            <Text mb={6} opacity={0.8}>
              Customize your idol's voice characteristics
            </Text>
            
            <Box mb={8}>
              <Text mb={2}>Voice Pitch</Text>
              <Slider
                aria-label="voice-pitch"
                value={voicePitch}
                onChange={(val) => setVoicePitch(val)}
                min={0}
                max={100}
              >
                <SliderTrack bg="gray.600">
                  <SliderFilledTrack bg="brand.primary" />
                </SliderTrack>
                <SliderThumb boxSize={6} bg="white" />
              </Slider>
              <Flex justify="space-between" width="100%" mt={1}>
                <Text fontSize="sm">Deep</Text>
                <Text fontSize="sm">Normal</Text>
                <Text fontSize="sm">High</Text>
              </Flex>
            </Box>
            
            <Text fontSize="sm" opacity={0.7} mb={4}>
              Additional voice customization options will be available in the full version
            </Text>
          </TabPanel>
        </TabPanels>
      </Tabs>

      <HStack mt={8} spacing={4} justify="center">
        <Button
          size="lg"
          colorScheme="blue"
          bgGradient="linear(to-r, brand.primary, brand.secondary)"
          _hover={{ opacity: 0.8 }}
          onClick={handleCreate}
        >
          Create Idol
        </Button>
        
        <Button
          size="lg"
          variant="outline"
          borderColor="brand.secondary"
          color="brand.secondary"
          _hover={{ bg: "rgba(0, 255, 255, 0.1)" }}
          onClick={handleMint}
        >
          Mint as NFT
        </Button>
      </HStack>
    </Box>
  );
};

export default IdolCreator; 