// app/profile/[playerId]/page.js
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/app/services/initializeFirebase'
import { notFound } from 'next/navigation'
import dynamic from 'next/dynamic'

const PlayerProfile = dynamic(() => import('@/app/components/PlayerProfile'), {
  ssr: false
})

// Server Side Rendering to fetch player data
async function getPlayerData(playerId) {
  try {
    // Format name for URL - handle special characters, multiple spaces, and accents
    const cleanString = (str) => {
      return (
        str
          .toLowerCase()
          // Replace accented characters with non-accented versions
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          // Replace multiple spaces with single dash
          .replace(/\s+/g, '-')
          // Remove any non-alphanumeric characters except dashes
          .replace(/[^a-z0-9-]/g, '')
          // Remove multiple consecutive dashes
          .replace(/-+/g, '-')
          // Remove leading/trailing dashes
          .replace(/^-+|-+$/g, '')
      )
    }

    const querySnapshot = await getDocs(collection(db, 'teams'))
    const teamsData = querySnapshot.docs.map((doc) => doc.data())
    const mensTeam = teamsData.find(
      (team) => team.name === 'University of California, Los Angeles (M)'
    )

    if (!mensTeam?.players) {
      console.error("Men's team or players not found")
      return null
    }

    // Find player by matching the cleaned versions of first and last names
    const [firstName, lastName] = playerId.split('-')
    const targetPlayer = mensTeam.players.find(
      (player) =>
        cleanString(player.firstName) === firstName &&
        cleanString(player.lastName) === lastName
    )

    if (!targetPlayer) {
      console.error('Player not found:', playerId)
      return null
    }

    return {
      name: `${targetPlayer.firstName} ${targetPlayer.lastName}`,
      bio: targetPlayer.bio || 'No bio available',
      height: targetPlayer.height,
      class: targetPlayer.class,
      age: targetPlayer.age,
      photo: targetPlayer.photo || null,
      largePlayerPhoto: targetPlayer.largePlayerPhoto || null,
      overallWins: targetPlayer.stats?.overallWins || 0,
      singleWins: targetPlayer.stats?.singleWins || 0,
      doubleWins: targetPlayer.stats?.doubleWins || 0
    }
  } catch (error) {
    console.error('Error retrieving player details:', error)
    throw new Error('Failed to fetch player data')
  }
}

export default async function PlayerProfilePage({ params }) {
  const playerData = await getPlayerData(params.playerId)
  if (!playerData) {
    notFound() // This will show the not-found.js page
  }

  return <PlayerProfile playerData={playerData} playerId={params.playerId} />
}
