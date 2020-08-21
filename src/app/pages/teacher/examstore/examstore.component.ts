import { Component, OnInit } from '@angular/core';
const _window: any = window;
@Component({
  selector: 'app-examstore',
  templateUrl: './examstore.component.html',
  styleUrls: ['./examstore.component.scss'],
})
export class ExamstoreComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    _window.ace.require('ace/ext/language_tools');

    var editor = _window.ace.edit('editor1');

    editor.session.setMode('ace/mode/sql');
    editor.setTheme('ace/theme/tomorrow');
    editor.setOptions({
      enableBasicAutocompletion: true,
      enableSnippets: true,
      enableLiveAutocompletion: true,
    });
  }
}
