import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-recording',
  templateUrl: './recording.component.html',
  styleUrls: ['./recording.component.css'],
  imports: [CommonModule, ReactiveFormsModule],
  providers: [ApiService]
})
export class RecordingComponent {
  recordForm: FormGroup;
  replayForm: FormGroup;
  testFilePath: string = '';
  message: string = '';
  replayMessage: string = '';
  tests: string[] = [];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService
  ) {
    this.recordForm = this.fb.group({
      url: ['https://example.com', [Validators.required, Validators.pattern('https?://.+')]],
      testName: ['', [Validators.required, Validators.minLength(3)]]
    });

    this.replayForm = this.fb.group({
      testName: ['', [Validators.required, Validators.minLength(3)]]
    });

    this.recordForm.markAsPristine();
    this.replayForm.markAsPristine();
    
    // Load available tests on component initialization
    this.loadTests();
  }

  loadTests() {
    this.apiService.getAllTests().subscribe({
      next: (tests) => {
        this.tests = tests;
      }
    });
  }

  openCodeGen() {
    if (this.recordForm.invalid) {
      this.recordForm.markAllAsTouched();
      return;
    }

    const { url, testName } = this.recordForm.value;
    this.apiService.startCodegen(url, testName).subscribe({
      next: (response) => {
        this.testFilePath = response.testFile;
        this.message = `Playwright CodeGen started. Test will be saved at: ${this.testFilePath}`;
        this.loadTests(); // Reload tests after successful recording
      }
    });
  }

  replayTest() {
    if (this.replayForm.invalid) {
      this.replayForm.markAllAsTouched();
      return;
    }

    const { testName } = this.replayForm.value;
    this.apiService.replayTest(testName).subscribe({
      next: (response) => {
        this.replayMessage = `Replaying test: ${testName}`;
      }
    });
  }
}