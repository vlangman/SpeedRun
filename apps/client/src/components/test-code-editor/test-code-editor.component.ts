import { Component, ElementRef, Input, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import * as ace from 'ace-builds';
import { Test } from '@shared';
import { ApiService } from '../../services/api.service';

@Component({
	selector: 'app-test-code-editor',
	imports: [CommonModule],
	providers: [
		// {
		// 	provide: ACE_CONFIG,
		// 	useValue: DEFAULT_ACE_CONFIG,
		// },
	],
	templateUrl: './test-code-editor.component.html',
	styleUrl: './test-code-editor.component.css',
})
export class TestCodeEditorComponent {
	@Input() test!: Test;
	@ViewChild('editor') private editor!: ElementRef<HTMLElement>;


	originalCode = '';
	aceEditor!: ace.Editor;


	constructor(private api: ApiService) {

	}

	ngOnInit()
	{
		this.originalCode = this.test.code;
	}


	
	ngOnChanges(changes: SimpleChanges){
		if(changes['test'] && this.editor != null){
			const aceEditor = ace.edit(this.editor.nativeElement);			
			aceEditor.session.setValue(this.test.code);
		}
	}

	ngAfterViewInit(): void {
		ace.config.set('basePath', 'https://unpkg.com/ace-builds@1.4.12/src-noconflict');

		this.aceEditor = ace.edit(this.editor.nativeElement);
		this.aceEditor.setOptions({
			fontSize: '14px',
			enableAutoIndent: true,
		});
		this.aceEditor.setTheme('ace/theme/twilight');
		this.aceEditor.session.setTabSize(4);

		this.aceEditor.session.setMode('ace/mode/javascript');
		// const aceEditor = ace.edit(this.editor.nativeElement);
		this.aceEditor.session.setValue(this.test.code);
		console.log(this.test.code);

		this.aceEditor.on('change', () => {
			console.log(this.aceEditor.getValue());
		});
	}


	saveCode(){
		this.api.saveTestCode(this.test.id, this.aceEditor.getValue()).subscribe((response) => {
			console.log(response);
		});
	}

	cancel(){
		this.test.code = this.originalCode;
	}
}
