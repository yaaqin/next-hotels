export interface roomMaintainenaceListProps {
  success: boolean
  message: string
  data: roomMaintainenaceListState[]
}

export interface roomMaintainenaceListState {
  id: string
  roomId: string
  startDate: string
  endDate: string
  priority: string
  status: string
  requestNote: string
  requestedAt: string
  requestedBy: string
  reviewNote: string
  reviewedAt: string
  reviewedBy: string
  startedAt?: string
  startedBy?: string
  completionNote?: string
  completedAt?: string
  completedBy?: string
  cancelNote: any
  cancelledAt: any
  cancelledBy: any
  room: Room
  requester: Requester
  reviewer: Reviewer
  starter?: Starter
  completer?: Completer
  canceller: any
}

export interface Room {
  id: string
  number: string
  siteCode: string
}

export interface Requester {
  id: string
  username: string
}

export interface Reviewer {
  id: string
  username: string
}

export interface Starter {
  id: string
  username: string
}

export interface Completer {
  id: string
  username: string
}
