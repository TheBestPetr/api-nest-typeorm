import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Device } from '../../domain/device.entity';

@Injectable()
export class DevicesRepo {
  constructor(
    @InjectRepository(Device) private readonly devicesRepo: Repository<Device>,
  ) {}
}
