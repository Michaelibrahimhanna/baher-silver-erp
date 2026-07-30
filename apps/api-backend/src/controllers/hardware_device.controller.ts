import { Request, Response } from 'express';
import { HardwareDeviceService } from '../services/hardware_device.service';

export class HardwareDeviceController {
  // =============================================================================
  // DEVICE REGISTRY
  // =============================================================================

  static async registerDevice(req: Request, res: Response) {
    try {
      const device = await HardwareDeviceService.registerDevice(req.body);
      return res.status(201).json({
        success: true,
        message: 'Hardware device registered successfully',
        data: device
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  static async listDevices(req: Request, res: Response) {
    try {
      const { branchId, stationId, category, status, search } = req.query;
      const devices = await HardwareDeviceService.listDevices({
        branchId: branchId as string,
        stationId: stationId as string,
        category: category as string,
        status: status as string,
        search: search as string
      });
      return res.json({
        success: true,
        count: devices.length,
        data: devices
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  static async getDeviceById(req: Request, res: Response) {
    try {
      const device = await HardwareDeviceService.getDeviceById(req.params.id);
      return res.json({ success: true, data: device });
    } catch (err: any) {
      return res.status(404).json({ success: false, error: err.message });
    }
  }

  static async updateDevice(req: Request, res: Response) {
    try {
      const device = await HardwareDeviceService.updateDevice(req.params.id, req.body);
      return res.json({
        success: true,
        message: 'Hardware device updated successfully',
        data: device
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  static async deleteDevice(req: Request, res: Response) {
    try {
      await HardwareDeviceService.deleteDevice(req.params.id);
      return res.json({ success: true, message: 'Hardware device deleted successfully' });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  static async setDefaultDevice(req: Request, res: Response) {
    try {
      const device = await HardwareDeviceService.setDefaultDevice(req.params.id);
      return res.json({
        success: true,
        message: 'Device set as default successfully',
        data: device
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  // =============================================================================
  // STATIONS (BRANCH -> STATION -> DEVICE)
  // =============================================================================

  static async createStation(req: Request, res: Response) {
    try {
      const station = await HardwareDeviceService.createStation(req.body);
      return res.status(201).json({
        success: true,
        message: 'Hardware station created successfully',
        data: station
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  static async listStations(req: Request, res: Response) {
    try {
      const { branchId } = req.query;
      const stations = await HardwareDeviceService.listStations(branchId as string);
      return res.json({ success: true, count: stations.length, data: stations });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  static async getStationById(req: Request, res: Response) {
    try {
      const station = await HardwareDeviceService.getStationById(req.params.id);
      return res.json({ success: true, data: station });
    } catch (err: any) {
      return res.status(404).json({ success: false, error: err.message });
    }
  }

  static async deleteStation(req: Request, res: Response) {
    try {
      await HardwareDeviceService.deleteStation(req.params.id);
      return res.json({ success: true, message: 'Station deleted successfully' });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  // =============================================================================
  // PROFILES
  // =============================================================================

  static async createProfile(req: Request, res: Response) {
    try {
      const profile = await HardwareDeviceService.createProfile(req.body);
      return res.status(201).json({
        success: true,
        message: 'Device profile created successfully',
        data: profile
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  static async listProfiles(req: Request, res: Response) {
    try {
      const { branchId } = req.query;
      const profiles = await HardwareDeviceService.listProfiles(branchId as string);
      return res.json({ success: true, count: profiles.length, data: profiles });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  static async getProfileById(req: Request, res: Response) {
    try {
      const profile = await HardwareDeviceService.getProfileById(req.params.id);
      return res.json({ success: true, data: profile });
    } catch (err: any) {
      return res.status(404).json({ success: false, error: err.message });
    }
  }

  // =============================================================================
  // DRIVER MANIFESTS
  // =============================================================================

  static async registerDriverManifest(req: Request, res: Response) {
    try {
      const driver = await HardwareDeviceService.registerDriverManifest(req.body);
      return res.status(201).json({
        success: true,
        message: 'Driver manifest registered successfully',
        data: driver
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  static async listDriverManifests(req: Request, res: Response) {
    try {
      const { category } = req.query;
      const drivers = await HardwareDeviceService.listDriverManifests(category as string);
      return res.json({ success: true, count: drivers.length, data: drivers });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  static async getDriverManifestById(req: Request, res: Response) {
    try {
      const driver = await HardwareDeviceService.getDriverManifestById(req.params.id);
      return res.json({ success: true, data: driver });
    } catch (err: any) {
      return res.status(404).json({ success: false, error: err.message });
    }
  }

  static async bindDeviceDriver(req: Request, res: Response) {
    try {
      const { driverId } = req.body;
      const device = await HardwareDeviceService.bindDeviceDriver(req.params.id, driverId);
      return res.json({
        success: true,
        message: 'Driver bound to device successfully',
        data: device
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  // =============================================================================
  // MAINTENANCE MODE
  // =============================================================================

  static async setMaintenanceMode(req: Request, res: Response) {
    try {
      const { inMaintenance, reason } = req.body;
      const device = await HardwareDeviceService.setMaintenanceMode(req.params.id, Boolean(inMaintenance), reason);
      return res.json({
        success: true,
        message: `Device maintenance mode ${inMaintenance ? 'ENABLED' : 'DISABLED'}`,
        data: device
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  // =============================================================================
  // CALIBRATION HISTORY
  // =============================================================================

  static async recordCalibration(req: Request, res: Response) {
    try {
      const log = await HardwareDeviceService.recordCalibration(req.params.id, req.body);
      return res.status(201).json({
        success: true,
        message: 'Calibration recorded successfully',
        data: log
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  static async listCalibrationLogs(req: Request, res: Response) {
    try {
      const logs = await HardwareDeviceService.listCalibrationLogs(req.params.id);
      return res.json({ success: true, count: logs.length, data: logs });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // =============================================================================
  // SPRINT 03.2: HEALTH MONITORING, PING & HEARTBEAT
  // =============================================================================

  static async pingDevice(req: Request, res: Response) {
    try {
      const deviceId = req.params.id || req.body.deviceId;
      const result = await HardwareDeviceService.pingDevice(deviceId, req.body.pingType || 'MANUAL_PING');
      return res.json({
        success: true,
        message: 'Device ping completed successfully',
        data: result
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  static async systemHeartbeat(req: Request, res: Response) {
    try {
      const { branchId } = req.query;
      const summary = await HardwareDeviceService.systemHeartbeat(branchId as string);
      return res.json({
        success: true,
        message: 'System-wide hardware heartbeat executed',
        data: summary
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  static async getHealthSummary(req: Request, res: Response) {
    try {
      const { branchId } = req.query;
      const summary = await HardwareDeviceService.getHealthSummary(branchId as string);
      return res.json({ success: true, data: summary });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // =============================================================================
  // SPRINT 03.2: AUTO RECONNECT
  // =============================================================================

  static async attemptAutoReconnect(req: Request, res: Response) {
    try {
      const { forceSuccess } = req.body;
      const result = await HardwareDeviceService.attemptAutoReconnect(req.params.id, forceSuccess !== false);
      return res.json({
        success: result.success,
        message: result.message,
        data: result
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  // =============================================================================
  // SPRINT 03.2: FIRMWARE TRACKING
  // =============================================================================

  static async updateFirmwareInfo(req: Request, res: Response) {
    try {
      const device = await HardwareDeviceService.updateFirmwareInfo(req.params.id, req.body);
      return res.json({
        success: true,
        message: 'Firmware information updated successfully',
        data: device
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  // =============================================================================
  // SPRINT 03.2: AUDIT LOGS
  // =============================================================================

  static async listAuditLogs(req: Request, res: Response) {
    try {
      const { deviceId, action, startDate, endDate } = req.query;
      const logs = await HardwareDeviceService.listAuditLogs({
        deviceId: deviceId as string,
        action: action as string,
        startDate: startDate as string,
        endDate: endDate as string
      });
      return res.json({ success: true, count: logs.length, data: logs });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // =============================================================================
  // SPRINT 03.3: HARDWARE SIMULATOR & CONNECTION TEST API
  // =============================================================================

  static async testConnection(req: Request, res: Response) {
    try {
      const { forceFail } = req.body;
      const result = await HardwareDeviceService.testConnection(req.params.id, Boolean(forceFail));
      return res.json({
        success: result.status === 'SUCCESS',
        message: result.handshakeMessage,
        data: result
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  static async executeSimulation(req: Request, res: Response) {
    try {
      const { action, payload, scenario } = req.body;
      const result = await HardwareDeviceService.executeSimulation(
        req.params.id,
        action,
        payload,
        scenario
      );
      return res.json({
        success: true,
        message: `Simulation '${action}' executed successfully (${scenario})`,
        data: result
      });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  static async getSimulatorStatus(req: Request, res: Response) {
    try {
      const status = HardwareDeviceService.getSimulatorEngineStatus();
      return res.json({ success: true, data: status });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }
}

