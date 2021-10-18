import { Box, Center, Container, Flex, Grid } from '@chakra-ui/layout'
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/tabs'
import { useRouter } from 'next/dist/client/router'
import { useContext, useEffect } from 'react'
import SignIn from '../../components/credentials/SignIn'
import SignUp from '../../components/credentials/SignUp'
import withAuth from '../../middlewares/withAuth'
import withRedirect from '../../middlewares/withRedirect'
import UserContext from '../../contexts/UserContext'

function Credentials() {
  return (
    <main>
      <Center minH="100vh">
        <Box shadow="lg" width="30%" rounded={10}>
          <Tabs width="full">
            <TabList roundedTop={10}>
              <Tab width="full">Sign In</Tab>
              <Tab width="full">Sign Up</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <SignIn />
              </TabPanel>
              <TabPanel>
                <SignUp />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Center>
    </main>
  )
}

export default Credentials
