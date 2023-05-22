import {
  Message,
  MessageAuthor,
  MessageAvatar,
  MessageContent,
  MessageFiles,
  MessageText,
} from './Message'
import { useReviewDetail } from '@/providers/ReviewDetailProvider'
import { MessagePopulated, ThreadPopulated, discriminateMessages } from 'common'
import { groupBy } from 'lodash'
import { Globe, MessageCircle } from 'lucide-react'
import { useState } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Badge,
  Separator,
} from 'ui'

const ThreadMessages = (props: { messages: MessagePopulated[] }) => {
  return (
    <div className="relative ml-5">
      {props.messages.length > 0 ? (
        props.messages.map((message, index) => {
          return (
            <Message key={index}>
              <MessageAvatar avatar={message.sentBy.avatar} />
              <MessageContent>
                <MessageAuthor
                  createdAt={message.createdAt}
                  sentBy={message.sentBy}
                />
                <MessageText message={message.content} />
                <MessageFiles
                  images={message.files.map((file) => {
                    return {
                      src: file.src,
                    }
                  })}
                />
              </MessageContent>
            </Message>
          )
        })
      ) : (
        <p className="italic">No replies yet</p>
      )}
    </div>
  )
}

const ThreadItem = (props: {
  thread: ThreadPopulated
  currentAccordionItem: string
}) => {
  const { starterMessage, subsequentMessages } = discriminateMessages(
    props.thread.messages
  )

  const accordionItemValue = props.thread.id.toString()

  const isMessagesCollapsed = accordionItemValue === props.currentAccordionItem

  return (
    <AccordionItem value={accordionItemValue}>
      <AccordionTrigger>
        <Message>
          <MessageAvatar avatar={starterMessage.sentBy.avatar} />
          <MessageContent>
            <MessageAuthor
              createdAt={starterMessage.createdAt}
              sentBy={starterMessage.sentBy}
            />
            <MessageText message={starterMessage.content} />
            <div className="flex flex-row items-center space-x-1 text-gray-500 text-sm">
              <MessageCircle className="h-4 w-4" />
              <span>{subsequentMessages.length}</span>
            </div>
          </MessageContent>
        </Message>
      </AccordionTrigger>
      <AccordionContent>
        {isMessagesCollapsed && (
          <ThreadMessages messages={subsequentMessages} />
        )}
      </AccordionContent>
    </AccordionItem>
  )
}

export const WebsiteReviewDetail = () => {
  const review = useReviewDetail()

  const [accordionItem, setAccordionItem] = useState('')

  return (
    <div>
      <Separator className="my-5" />

      <div className="flex flex-col space-y-5">
        <div className="flex flex-row items-center space-x-2">
          <Badge className="mt-5">{review.type}</Badge>
          <div className="flex flex-row space-x-2">
            <Globe />
            <a
              href={review.website}
              target="_blank"
              className="hover:underline cursor-pointer"
            >
              {review.website}
            </a>
          </div>
        </div>

        <div className="flex flex-col space-y-5">
          <h3 className="text-2xl font-bold text-primary">Threads</h3>
          <ul>
            <Accordion
              collapsible
              className="w-full"
              type="single"
              value={accordionItem}
              onValueChange={setAccordionItem}
            >
              {Object.entries(
                groupBy(review.threads, (thread) => thread.pathname)
              ).map(([path, threads]) => {
                return (
                  <div className="flex flex-col space-x-5" key={path}>
                    <div className="flex flex-row items-center space-x-2 font-bold">
                      <Badge>Route</Badge>
                      <h4>{path}</h4>
                    </div>
                    <div className="ml-5">
                      {threads.map((thread) => {
                        return (
                          <ThreadItem
                            key={thread.id.toString()}
                            currentAccordionItem={accordionItem}
                            thread={thread}
                          />
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </Accordion>
          </ul>
        </div>
      </div>
    </div>
  )
}
