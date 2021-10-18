import { Flex, HStack, Link, Spacer, VStack } from '@chakra-ui/layout'
import react from 'react'

export default function Navbar() {
  return (
    <VStack>
      <Flex w="100%" bg="#3498DB" flexDir="row" p={4} alignItems='center'>
        <Link href='/' fontSize='lg' textColor='#f6f6f6' fontWeight='bold'>Drawing Together</Link>
        <Spacer/>

        <HStack textColor="#f6f6f6">

          <Link href='/dashboard' p={2} shadow='xl' borderWidth='2px' rounded={4}>Dashboard</Link>
          <Link href='/community'>Community</Link>



        </HStack>
      </Flex>
    </VStack>
  )
}
