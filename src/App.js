import React from 'react';
import { Box, Container, Heading, VStack } from '@chakra-ui/react';
import IdolCreator from './components/IdolCreator';
import Navigation from './components/Navigation';

function App() {
  return (
    <Box bg="brand.dark" minH="100vh" color="white">
      <Navigation />
      <Container maxW="container.xl" py={10}>
        <VStack spacing={8} align="stretch">
          <Heading as="h1" size="2xl" textAlign="center" bgGradient="linear(to-r, brand.primary, brand.secondary)" bgClip="text">
            Verse ArenaDream
          </Heading>
          <Heading as="h2" size="md" textAlign="center" opacity={0.8}>
            Create Your Virtual Idol in the Metaverse
          </Heading>
          <IdolCreator />
        </VStack>
      </Container>
    </Box>
  );
}

export default App; 