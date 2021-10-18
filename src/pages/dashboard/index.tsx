import { useRouter } from 'next/dist/client/router'
import React, { useContext, useEffect } from 'react'
import useSWR from 'swr'
import UserContext from '../../contexts/UserContext'

import dynamic from 'next/dynamic'
import withAuth from '../../middlewares/withAuth'
import { Box, Flex, Link, VStack } from '@chakra-ui/layout'
import Navbar from '../../components/Navbar'

function Dashboard() {
  return <Navbar/>
}

export default withAuth(Dashboard, '/credentials')