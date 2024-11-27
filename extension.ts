import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    // Count total words in the document
    const totalWordsCommand = vscode.commands.registerCommand('text-word-counter.totalWords', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor found!');
            return;
        }
        const documentText = editor.document.getText();
        const totalWords = documentText.match(/\b\w+\b/g)?.length || 0;
        vscode.window.showInformationMessage(`Total words in document: ${totalWords}`);
    });

    // Count words in a function
    const countWordsInFunctionCommand = vscode.commands.registerCommand('text-word-counter.countWordsInFunction', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor found!');
            return;
        }
        const documentText = editor.document.getText();

        // Detect functions
        const functionRegex = /(void|int)\s+(\w+)\s*\([^)]*\)\s*\{([\s\S]*?)\}/g;
        const functions = [...documentText.matchAll(functionRegex)].map(match => ({
            name: match[2],
            body: match[3],
        }));

        if (functions.length === 0) {
            vscode.window.showInformationMessage('No functions detected in the file.');
            return;
        }

        const choice = await vscode.window.showQuickPick(functions.map(fn => fn.name), {
            placeHolder: 'Select a function to count words',
        });

        if (!choice) {
            vscode.window.showInformationMessage('Operation cancelled.');
            return;
        }

        const selectedFunction = functions.find(fn => fn.name === choice);
        if (selectedFunction) {
            const wordCount = selectedFunction.body.match(/\b\w+\b/g)?.length || 0;
            vscode.window.showInformationMessage(`Word count for function '${choice}': ${wordCount}`);
        }
    });

    // Count words in selected text
    const countWordsInSelectionCommand = vscode.commands.registerCommand('text-word-counter.countWordsInSelection', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor found!');
            return;
        }

        const selection = editor.selection;
        const selectedText = editor.document.getText(selection);

        if (!selectedText.trim()) {
            vscode.window.showInformationMessage('No text selected.');
            return;
        }

        const wordCount = selectedText.match(/\b\w+\b/g)?.length || 0;
        vscode.window.showInformationMessage(`Word count for selected text: ${wordCount}`);
    });

    context.subscriptions.push(totalWordsCommand, countWordsInFunctionCommand, countWordsInSelectionCommand);
}

export function deactivate() {}
