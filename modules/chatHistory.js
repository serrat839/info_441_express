class ListNode {
    constructor (userData) {
        this.next = null
        this.previous = null
        this.data = userData
    }
}

class LinkedList {
    constructor (maxLen) {
        this.head
        this.length = 0
        this.maxLen = maxLen
    }

    add(chatter) {
        let newNode = new ListNode(chatter)
        if (this.length == 0) {
            this.head = newNode
        } else {
            let cur = this.head
            while (cur.next) {
                cur = cur.next
            }
            cur.next = newNode
        }
        this.length++
        if (this.length > this.maxLen) {
            this.head = this.head.next
        }

    }
}

export default class ChatHistory {

    constructor (maxHistory) {
        this.log = new LinkedList(maxHistory)
        return
    }

    add(chatter) {
        this.log.add(chatter)
    }

    getLog() {
        let returnable = []
        let cur = this.log.head
        while (cur) {
            returnable.push(cur.data)
            cur = cur.next
        }
        return returnable
    }
}