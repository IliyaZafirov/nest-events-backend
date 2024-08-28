import { Controller, Get, Post, Patch, Delete, Param, Body, HttpCode, ParseIntPipe, Logger, NotFoundException, Query, UsePipes, ValidationPipe } from "@nestjs/common";
import { CreateEventDto } from "./input/create-event.dto";
import { UpdateEventDto } from "./input/update-event.dto";
import { Event } from "./event.entity";
import { Like, MoreThan, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { EventsService } from "./events.service";
import { ListEvents } from "./input/list.events";


@Controller('/events')
export class EventsController {
    private readonly logger = new Logger(EventsController.name)

    constructor(
        @InjectRepository(Event)
        private readonly repository: Repository<Event>,
        // @InjectRepository(Attendee)
        // private readonly attendeeRepository: Repository<Attendee>,
        private readonly eventsService: EventsService
    ) { }

    private events: Event[] = [];

    @Get()
    @UsePipes(new ValidationPipe({ transform: true }))
    async findAll(@Query() filter: ListEvents) {

        const events = await this.eventsService.getEventsWithAttendeeCountFilteredPaginated(
            filter,
            {
                total: true,
                currentPage: filter.page,
                limit: 2
            });
        return events;
    }
    // SELECT id, name FROM event WHERE (event.id > 3 AND event.when > '2021-02-12T13:00:00') OR event.description LIKE '%meet%' ORDER BY event.id DESC LIMIT 2
    @Get('/practice')
    async practice() {
        return await this.repository.find({
            select: ['id', 'when'],
            where: [{
                id: MoreThan(3),
                when: MoreThan(new Date('2021-02-12T13:00:00'))
            }, {
                description: Like('%meet%')
            }],
            take: 2,
            order: {
                id: 'DESC'
            }
        });
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {

        const event = await this.eventsService.getEvent(id);

        if (!event) {
            throw new NotFoundException();
        }

        return event;
    }

    @Post()
    async create(@Body() input: CreateEventDto) {
        return await this.repository.save({
            ...input,
            when: new Date(input.when)
        });
    }

    @Patch(':id')
    async update(@Param('id') id, @Body() input: UpdateEventDto) {
        const event = await this.repository.findOne(id);

        if (!event) {
            throw new NotFoundException();
        }

        return await this.repository.save({
            ...event,
            ...input,
            when: input.when ? new Date(input.when) : event.when
        })
    }

    @Delete(':id')
    @HttpCode(204)
    async remove(@Param('id') id) {
        const result = await this.eventsService.deleteEvent(id);

        if (result?.affected !== 1) {
            throw new NotFoundException();
        }

    }
}