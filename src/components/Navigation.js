import React from 'react';
import { Flex, Button, HStack, Image, Spacer, useColorModeValue } from '@chakra-ui/react';

const Navigation = () => {
  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      w="100%"
      p={4}
      bg="rgba(0, 0, 0, 0.7)"
      color="white"
      backdropFilter="blur(10px)"
      position="sticky"
      top={0}
      zIndex={1000}
    >
      <HStack>
        <Image 
          src="/logo.png" 
          alt="Verse ArenaDream Logo" 
          fallbackSrc="https://via.placeholder.com/50x50?text=VAD"
          boxSize="50px"
          borderRadius="md"
        />
      </HStack>
      
      <Spacer />
      
      <HStack spacing={4}>
        <Button variant="ghost" _hover={{ bg: 'brand.primary', color: 'black' }}>
          Create
        </Button>
        <Button variant="ghost" _hover={{ bg: 'brand.primary', color: 'black' }}>
          Explore
        </Button>
        <Button variant="ghost" _hover={{ bg: 'brand.primary', color: 'black' }}>
          Marketplace
        </Button>
        <Button bgGradient="linear(to-r, brand.primary, brand.secondary)" color="white" _hover={{ opacity: 0.8 }}>
          Connect Wallet
        </Button>
      </HStack>
    </Flex>
  );
};

export default Navigation; 