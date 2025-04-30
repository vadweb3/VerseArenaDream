import React, { useEffect, useState } from 'react';
import {
  Button,
  Text,
  HStack,
  VStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Icon,
  Badge,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Box,
  Flex,
  Image,
} from '@chakra-ui/react';
import { ChevronDownIcon, ExternalLinkIcon, CopyIcon, WarningIcon } from '@chakra-ui/icons';
import { FaEthereum, FaWallet } from 'react-icons/fa';
import { SiChainlink } from 'react-icons/si';
import { useDispatch, useSelector } from 'react-redux';

import { connectWallet, disconnect, switchChain } from '../../store/slices/walletSlice';
import { RootState, AppDispatch } from '../../store';
import { CHAIN_CONFIG } from '../../config';
import { ChainId } from '../../types';

const WalletConnect: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const { walletInfo, isConnecting, error, selectedChain } = useSelector(
    (state: RootState) => state.wallet
  );
  
  const [isCopied, setIsCopied] = useState(false);

  // Handle wallet connection
  const handleConnectWallet = async () => {
    try {
      await dispatch(connectWallet());
      toast({
        title: 'Wallet Connected',
        description: 'Your wallet has been connected successfully!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Connection Failed',
        description: (error as Error).message || 'Failed to connect wallet',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Handle wallet disconnection
  const handleDisconnect = () => {
    dispatch(disconnect());
    toast({
      title: 'Wallet Disconnected',
      description: 'Your wallet has been disconnected.',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  // Handle chain switching
  const handleSwitchChain = async (chainId: ChainId) => {
    try {
      await dispatch(switchChain(chainId));
      toast({
        title: 'Network Switched',
        description: `Switched to ${CHAIN_CONFIG[chainId].name}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Network Switch Failed',
        description: (error as Error).message || 'Failed to switch network',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Copy wallet address to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    
    toast({
      title: 'Address Copied',
      description: 'Wallet address copied to clipboard',
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
  };

  // Format address for display (0x123...abc)
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Get explorer URL for current chain
  const getExplorerUrl = (address: string) => {
    const chainConfig = CHAIN_CONFIG[selectedChain];
    return `${chainConfig.blockExplorerUrls[0]}/address/${address}`;
  };

  // Show error if wallet connection fails
  useEffect(() => {
    if (error) {
      toast({
        title: 'Wallet Error',
        description: error,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [error, toast]);

  if (!walletInfo.isConnected) {
    return (
      <Button
        leftIcon={<Icon as={FaWallet} />}
        colorScheme="purple"
        bgGradient="linear(to-r, brand.primary, brand.secondary)"
        color="white"
        _hover={{ opacity: 0.8 }}
        onClick={handleConnectWallet}
        isLoading={isConnecting}
        loadingText="Connecting..."
      >
        Connect Wallet
      </Button>
    );
  }

  return (
    <>
      <Menu>
        <MenuButton
          as={Button}
          rightIcon={<ChevronDownIcon />}
          leftIcon={
            <Image
              src={CHAIN_CONFIG[selectedChain]?.logoUrl}
              alt={CHAIN_CONFIG[selectedChain]?.name}
              boxSize="20px"
              fallbackSrc="https://via.placeholder.com/20"
              borderRadius="full"
            />
          }
          variant="outline"
          borderColor="brand.primary"
          borderWidth="2px"
          _hover={{ bg: 'rgba(255, 87, 185, 0.1)' }}
        >
          <HStack spacing={2}>
            <Text fontWeight="bold">{formatAddress(walletInfo.address)}</Text>
            <Badge colorScheme="green" variant="solid">
              {walletInfo.balance} {CHAIN_CONFIG[selectedChain]?.symbol}
            </Badge>
          </HStack>
        </MenuButton>
        <MenuList bg="gray.800" borderColor="brand.primary">
          <VStack px={3} py={2} align="start">
            <Text fontSize="sm" color="gray.400">Connected to</Text>
            <HStack>
              <Image
                src={CHAIN_CONFIG[selectedChain]?.logoUrl}
                alt={CHAIN_CONFIG[selectedChain]?.name}
                boxSize="20px"
                fallbackSrc="https://via.placeholder.com/20"
                borderRadius="full"
              />
              <Text fontWeight="bold">{CHAIN_CONFIG[selectedChain]?.name}</Text>
            </HStack>
          </VStack>
          <MenuDivider />
          <MenuItem 
            icon={<CopyIcon />} 
            onClick={() => copyToClipboard(walletInfo.address)}
            _hover={{ bg: 'rgba(255, 87, 185, 0.1)' }}
          >
            {isCopied ? 'Copied!' : 'Copy Address'}
          </MenuItem>
          <MenuItem 
            icon={<ExternalLinkIcon />} 
            as="a" 
            href={getExplorerUrl(walletInfo.address)} 
            target="_blank"
            _hover={{ bg: 'rgba(255, 87, 185, 0.1)' }}
          >
            View on Explorer
          </MenuItem>
          <MenuDivider />
          <MenuItem 
            onClick={onOpen}
            _hover={{ bg: 'rgba(255, 87, 185, 0.1)' }}
          >
            Switch Network
          </MenuItem>
          <MenuDivider />
          <MenuItem 
            icon={<WarningIcon color="red.400" />} 
            onClick={handleDisconnect}
            _hover={{ bg: 'rgba(255, 0, 0, 0.1)' }}
          >
            Disconnect
          </MenuItem>
        </MenuList>
      </Menu>

      {/* Network Switching Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent bg="gray.800" borderWidth={1} borderColor="brand.primary">
          <ModalHeader>Switch Network</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={3} align="stretch">
              {Object.values(CHAIN_CONFIG).map((chain) => (
                <Box
                  key={chain.chainId}
                  p={3}
                  borderRadius="md"
                  borderWidth={1}
                  borderColor={selectedChain === chain.chainId ? "brand.primary" : "transparent"}
                  bg={selectedChain === chain.chainId ? "rgba(255, 87, 185, 0.1)" : "gray.700"}
                  cursor="pointer"
                  _hover={{ bg: "rgba(255, 87, 185, 0.05)" }}
                  onClick={() => {
                    handleSwitchChain(chain.chainId as ChainId);
                    onClose();
                  }}
                >
                  <Flex alignItems="center">
                    <Image
                      src={chain.logoUrl}
                      alt={chain.name}
                      boxSize="30px"
                      fallbackSrc="https://via.placeholder.com/30"
                      borderRadius="full"
                      mr={3}
                    />
                    <VStack spacing={0} align="start">
                      <Text fontWeight="bold">{chain.name}</Text>
                      <Text fontSize="xs" color="gray.400">
                        {chain.nativeCurrency.symbol}
                      </Text>
                    </VStack>
                    {selectedChain === chain.chainId && (
                      <Badge ml="auto" colorScheme="green">Connected</Badge>
                    )}
                  </Flex>
                </Box>
              ))}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default WalletConnect; 