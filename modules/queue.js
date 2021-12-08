class ListNode {
    constructor (userData) {
        this.next = null
        this.previous = null
        this.data = userData
    }
}

class LinkedList {
    constructor () {
        this.head
        this.tail
        this.index = new Map()
        this.length = 0
    }

    add(userData) {
        let newNode = new ListNode(userData)
        if (this.length == 0) {
            this.head = newNode
            this.tail = this.head
        } else {
            this.tail.next = newNode
            newNode.previous = this.tail
            this.tail = this.tail.next
        }
        this.index.set(userData, newNode)
        this.length++
    }
    remove(userData) {
        let oldNode = this.index.get(userData)
        if (this.length == 0) {
            return null
        } else if (this.length == 1) {
            this.head = null
            this.tail = null
        } else if (oldNode === this.tail) {
            this.tail = oldNode.previous
            this.tail.next = null
        } else if (oldNode === this.head) {
            this.head = oldNode.next
            oldNode.next = null
        } else {
            oldNode.previous.next = oldNode.next
            oldNode.next.previous = oldNode.previous
        }
        this.length--
        this.index.delete(userData)
        return oldNode
    }
    getFirst() {
        if (this.length > 0) {
            let first = this.head.data
            this.remove(first)
            return first
        }
        return null
    }
}

export default class Queue {

    constructor (gameSize) {
        this.gameSize = gameSize
        this.queue = new LinkedList()
        return
    }
    enqueue(userData) {
        this.queue.add(userData)
    }

    dequeue(userData) {
        this.queue.remove(userData)
    }

    popQueue() {
        if (this.queue.length >= this.gameSize) {
            let players = []
            for (let i = 0; i < this.gameSize; i++) {
                players.push(this.queue.getFirst())
            }
            return players
        }
        console.log("Not enough players!")
        return []
    }

    get length() {
        return this.queue.length
    }
}